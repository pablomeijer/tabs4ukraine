import { useState, useEffect } from 'react'
import { auth, userProfile, User } from '../lib/supabase'
import './AuthComponent.css'

interface AuthComponentProps {
  onAuthChange: (user: User | null) => void
}

export const AuthComponent = ({ onAuthChange }: AuthComponentProps) => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for existing session
    checkUser()
    
    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await handleUserLogin(session.user)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        onAuthChange(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkUser = async () => {
    const { user } = await auth.getCurrentUser()
    if (user) {
      await handleUserLogin(user)
    }
  }

  const handleUserLogin = async (supabaseUser: any) => {
    try {
      console.log('Handling user login for:', supabaseUser.id)
      
      // Get or create user profile
      let { data: profile, error } = await userProfile.getProfile(supabaseUser.id)
      console.log('Profile lookup result:', { profile, error })
      
      if (error && error.code === 'PGRST116') {
        console.log('Profile not found, creating new profile...')
        // Profile doesn't exist, create it
        const { data: newProfile, error: createError } = await userProfile.createProfile(
          supabaseUser.id,
          supabaseUser.email,
          supabaseUser.user_metadata?.username
        )
        console.log('Profile creation result:', { newProfile, createError })
        if (createError) throw createError
        profile = newProfile
      } else if (error) {
        throw error
      }

      const userData: User = {
        id: supabaseUser.id,
        email: supabaseUser.email,
        username: profile?.username,
        created_at: supabaseUser.created_at,
        ad_count: profile?.ad_count || 1,
        total_donations: profile?.total_donations || 0
      }

      setUser(userData)
      onAuthChange(userData)
    } catch (error: any) {
      console.error('Error handling user login:', error)
      setError(`Failed to load user profile: ${error.message || error}`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isSignUp) {
        console.log('Attempting to sign up user:', { email, username })
        const { data, error } = await auth.signUp(email, password, username)
        if (error) throw error
        
        console.log('Signup successful:', data)
        
        // If signup successful, create profile manually
        if (data.user && data.user.email) {
          console.log('User created, creating profile...', {
            userId: data.user.id,
            email: data.user.email,
            username: username || data.user.email.split('@')[0]
          })
          
          const { data: profileData, error: profileError } = await userProfile.createProfile(
            data.user.id,
            data.user.email,
            username || data.user.email.split('@')[0]
          )
          
          console.log('Profile creation result:', { profileData, profileError })
          
          if (profileError) {
            console.error('Profile creation error:', profileError)
            console.error('Error details:', {
              message: profileError.message,
              details: profileError.details,
              hint: profileError.hint,
              code: profileError.code
            })
            // Don't throw here, user was created successfully
          }
        }
        
        setError('Check your email to confirm your account!')
      } else {
        const { error } = await auth.signIn(email, password)
        if (error) throw error
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    setLoading(true)
    const { error } = await auth.signOut()
    if (error) {
      setError(error.message)
    }
    setLoading(false)
  }

  if (user) {
    return (
      <div className="auth-container">
        <div className="auth-user-info">
          <div className="auth-avatar">
            {user.username?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
          </div>
          <div className="auth-user-details">
            <h3 className="auth-username">{user.username || 'User'}</h3>
            <p className="auth-email">{user.email}</p>
            <div className="auth-stats">
              <span className="auth-stat">
                <strong>{user.ad_count}</strong> ads
              </span>
              <span className="auth-stat">
                <strong>${user.total_donations}</strong> donated
              </span>
            </div>
          </div>
        </div>
        <button 
          className="auth-button signout" 
          onClick={handleSignOut}
          disabled={loading}
        >
          {loading ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h3 className="auth-title">
          {isSignUp ? 'Create Account' : 'Sign In'}
        </h3>
        <p className="auth-subtitle">
          {isSignUp 
            ? 'Join Tabs4Palestine to track your impact' 
            : 'Welcome back to Tabs4Palestine'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {isSignUp && (
          <div className="auth-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              required={isSignUp}
            />
          </div>
        )}

        <div className="auth-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          className="auth-button primary"
          disabled={loading}
        >
          {loading 
            ? (isSignUp ? 'Creating account...' : 'Signing in...') 
            : (isSignUp ? 'Create Account' : 'Sign In')
          }
        </button>
      </form>

      <div className="auth-switch">
        <p>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button 
            className="auth-switch-button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError('')
            }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default AuthComponent 