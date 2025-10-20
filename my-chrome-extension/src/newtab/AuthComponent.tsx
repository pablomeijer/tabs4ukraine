import { useState, useEffect } from 'react'
import { auth, userProfile, User, supabase, gamificationTracker } from '../lib/supabase'
import './AuthComponent.css'

interface AuthComponentProps {
  onAuthChange: (user: User | null) => void
  gamificationUser?: any
  totalDonations?: number
}

export const AuthComponent = ({ onAuthChange, gamificationUser, totalDonations }: AuthComponentProps) => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [signupSuccess, setSignupSuccess] = useState(false)
  
  // Provide default values to prevent undefined errors
  const safeGamificationUser = gamificationUser || {}
  const safeTotalDonations = totalDonations || 0
  
  // Debug logging
  console.log('AuthComponent props:', { gamificationUser, totalDonations, safeGamificationUser, safeTotalDonations })
  
  // Add loading state for when data is being fetched
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [localGamificationData, setLocalGamificationData] = useState<any>(null)

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

  // Load gamification data when user is available
  useEffect(() => {
    const loadGamificationData = async () => {
      if (user?.id) {
        setIsLoadingData(true)
        try {
          const result = await gamificationTracker.getUserProfile(user.id)
          if (result.success) {
            setLocalGamificationData(result.data)
          }
        } catch (error) {
          console.error('Error loading gamification data:', error)
        } finally {
          setIsLoadingData(false)
        }
      } else {
        setLocalGamificationData(null)
      }
    }

    loadGamificationData()
  }, [user])

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
        const createResult = await userProfile.createProfile(
          supabaseUser.id,
          supabaseUser.email,
          supabaseUser.user_metadata?.username
        )
        const { data: newProfile, error: createError } = createResult || { data: null, error: null }
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
        total_donations: profile?.total_donations || 0,
        sponsored_donations: profile?.sponsored_donations || 0,
        total_raised: profile?.total_raised || 0,
        rank: profile?.rank || 0,
        tier: profile?.tier || 'beginner',
        invite_code: profile?.invite_code,
        daily_streak: profile?.daily_streak || 0
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
        
        // Check if user needs email confirmation
        if (data.user && !data.session) {
          console.log('User created but needs email confirmation')
          setSignupSuccess(true)
          setError('Account created! Please check your email and click the confirmation link to activate your account. You can then sign in.')
          
          // Still create the profile even without session
          if (data.user && data.user.email) {
            console.log('Creating profile for unconfirmed user...', {
              userId: data.user.id,
              email: data.user.email,
              username: username || data.user.email.split('@')[0]
            })
            
            const createResult = await userProfile.createProfile(
              data.user.id,
              data.user.email,
              username || data.user.email.split('@')[0]
            )
            const { data: profileData, error: profileError } = createResult || { data: null, error: null }
            
            console.log('Profile creation result for unconfirmed user:', { profileData, profileError })
            
            if (profileError) {
              console.error('Profile creation error for unconfirmed user:', profileError)
            }
          }
          return
        }
        
        // If signup successful and user is immediately signed in, create profile
        if (data.user && data.user.email) {
          console.log('User created, creating profile...', {
            userId: data.user.id,
            email: data.user.email,
            username: username || data.user.email.split('@')[0]
          })
          
          const createResult = await userProfile.createProfile(
            data.user.id,
            data.user.email,
            username || data.user.email.split('@')[0]
          )
          const { data: profileData, error: profileError } = createResult || { data: null, error: null }
          
          console.log('Profile creation result:', { profileData, profileError })
          
          if (profileError) {
            console.error('Profile creation error:', profileError)
            console.error('Error details:', {
              message: (profileError as any).message,
              details: (profileError as any).details,
              hint: (profileError as any).hint,
              code: (profileError as any).code
            })
            setError(`Account created but profile setup failed: ${(profileError as any).message}`)
            return
          }
          
          // If profile created successfully, handle the login
          if (profileData) {
            await handleUserLogin(data.user)
            setError('') // Clear any previous errors
          }
        } else {
          setError('Account creation failed - please try again')
        }
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
            {user?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="auth-user-details">
            <h3 className="auth-username">{user?.username || 'User'}</h3>
            <p className="auth-email">{user?.email || 'Not available'}</p>
            <div className="auth-stats">
              <div className="auth-stat-group">
                <h4>Your Impact</h4>
                {isLoadingData ? (
                  <div className="auth-loading">
                    <p>Loading your stats...</p>
                  </div>
                ) : (
                  <div className="auth-stat-grid">
                    <div className="auth-stat-item">
                      <span className="auth-stat-number">{localGamificationData?.tabs_opened || 0}</span>
                      <span className="auth-stat-label">Tabs Opened</span>
                    </div>
                    <div className="auth-stat-item">
                      <span className="auth-stat-number">${(user?.total_donations || 0).toFixed(2)}</span>
                      <span className="auth-stat-label">Money Raised</span>
                    </div>
                    <div className="auth-stat-item">
                      <span className="auth-stat-number">{user?.ad_count || 1}</span>
                      <span className="auth-stat-label">Ad Level</span>
                    </div>
                    <div className="auth-stat-item">
                      <span className="auth-stat-number">{localGamificationData?.achievements_unlocked || 0}</span>
                      <span className="auth-stat-label">Achievements</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="auth-account-info">
                <h4>Account Details</h4>
                <div className="auth-account-details">
                  <p><strong>Username:</strong> {user?.username || 'Not set'}</p>
                  <p><strong>Email:</strong> {user?.email || 'Not available'}</p>
                  <p><strong>Member since:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}</p>
                </div>
              </div>
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
            ? 'Join Tabs4Ukraine to track your impact' 
            : 'Welcome back to Tabs4Ukraine'
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

      {signupSuccess ? (
        <div className="auth-success">
          <p>Account created successfully! You can now sign in:</p>
          <button 
            className="auth-button primary"
            onClick={() => {
              setSignupSuccess(false)
              setIsSignUp(false)
              setError('')
            }}
          >
            Sign In Now
          </button>
        </div>
      ) : (
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
      )}
      
      {/* Debug section - remove in production */}
      <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '5px' }}>
        <h4>Debug Info:</h4>
        <p>Current user: {user ? `${(user as any).username || 'Unknown'} (${(user as any).email || 'No email'})` : 'Not logged in'}</p>
        <button 
          onClick={async () => {
            console.log('Testing profile creation...')
            try {
              const testUuid = crypto.randomUUID()
              console.log('Using test UUID:', testUuid)
              const testResult = await userProfile.createProfile(testUuid, 'test@example.com', 'testuser')
              console.log('Test profile creation result:', testResult)
            } catch (error) {
              console.error('Test profile creation error:', error)
            }
          }}
          style={{ padding: '5px 10px', marginTop: '5px' }}
        >
          Test Profile Creation
        </button>
        <button 
          onClick={async () => {
            console.log('Testing Supabase function...')
            try {
              // Generate a proper UUID for testing
              const testUuid = crypto.randomUUID()
              console.log('Using test UUID:', testUuid)
              
              const { data, error } = await supabase.rpc('create_user_profile', {
                user_id: testUuid,
                user_email: 'test2@example.com',
                user_username: 'testuser2'
              })
              console.log('Direct function test result:', { data, error })
            } catch (error) {
              console.error('Direct function test error:', error)
            }
          }}
          style={{ padding: '5px 10px', marginTop: '5px', marginLeft: '5px' }}
        >
          Test Function Directly
        </button>
      </div>
    </div>
  )
}

export default AuthComponent 