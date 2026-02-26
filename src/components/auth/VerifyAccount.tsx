import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, AlertCircle, CheckCircle2, Loader2, ExternalLink, RefreshCw } from 'lucide-react';

export function VerifyAccountPage() {
  const navigate = useNavigate();
  const { userProfile, sendMagicLink, checkEmailVerificationStatus, logout } = useAuth();

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [checking, setChecking] = useState(false);

  // Use ref to track if we've already redirected
  const hasRedirectedRef = useRef(false);

  // Check if already verified on mount - ONLY ONCE
  useEffect(() => {
    if (!userProfile) {
      console.log('❌ No user profile, redirecting to login');
      navigate('/login');
      return;
    }

    // If already verified and haven't redirected yet, redirect once
    if (userProfile.email_verified && !hasRedirectedRef.current) {
      console.log('✅ Email already verified, redirecting to dashboard...');
      hasRedirectedRef.current = true;
      navigate('/dashboard', { replace: true });
    }
  }, []); // Empty dependency array - run only once on mount

  // Poll for verification status every 3 seconds when link is sent
  useEffect(() => {
    if (!linkSent) return;

    const interval = setInterval(async () => {
      console.log('🔍 Checking verification status...');
      setChecking(true);
      
      const isVerified = await checkEmailVerificationStatus();
      
      setChecking(false);

      if (isVerified) {
        console.log('🎉 Email verified!');
        setSuccess('Email verified successfully! Redirecting to dashboard...');
        setError('');
        
        // Stop polling
        clearInterval(interval);
        
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 2000);
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [linkSent, checkEmailVerificationStatus, navigate]);

  // Send magic link
  const handleSendMagicLink = async () => {
    if (!userProfile?.email) {
      setError('No email address found');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      console.log('📧 Sending magic link to:', userProfile.email);
      await sendMagicLink(userProfile.email);

      setSuccess('Verification link sent! Check your email and click the link to verify.');
      setLinkSent(true);
      
      console.log('✅ Magic link sent');
    } catch (err: any) {
      console.error('❌ Send magic link error:', err);
      setError(err.message || 'Failed to send verification link');
    } finally {
      setLoading(false);
    }
  };

  // Manual refresh verification status
  const handleCheckStatus = async () => {
    try {
      setChecking(true);
      setError('');

      console.log('🔍 Manually checking verification status...');
      const isVerified = await checkEmailVerificationStatus();

      if (isVerified) {
        setSuccess('Email verified successfully! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 2000);
      } else {
        setError('Email not verified yet. Please check your email and click the verification link.');
      }
    } catch (err: any) {
      console.error('❌ Check status error:', err);
      setError(err.message || 'Failed to check verification status');
    } finally {
      setChecking(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Don't render if already verified (prevent flash)
  if (userProfile?.email_verified) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h1>
            <p className="text-gray-600 text-sm">
              Click the button below to receive a verification link
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          {/* Email Display */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Your email address:</p>
            <p className="font-semibold text-gray-900">{userProfile?.email}</p>
          </div>

          {/* Send Magic Link Button */}
          {!linkSent ? (
            <button
              onClick={handleSendMagicLink}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <ExternalLink className="w-5 h-5" />
                  Send Verification Link
                </>
              )}
            </button>
          ) : (
            <>
              {/* Instructions after link sent */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Check Your Email
                </h3>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Open your email inbox</li>
                  <li>Find the verification email</li>
                  <li>Click the verification link</li>
                  <li>You'll be redirected automatically</li>
                </ol>
              </div>

              {/* Auto-checking indicator */}
              {checking && (
                <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                  <p className="text-sm text-gray-600">Checking verification status...</p>
                </div>
              )}

              {/* Manual check button */}
              <button
                onClick={handleCheckStatus}
                disabled={checking}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-3"
              >
                {checking ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    I've Clicked the Link
                  </>
                )}
              </button>

              {/* Resend button */}
              <button
                onClick={handleSendMagicLink}
                disabled={loading}
                className="w-full text-blue-600 hover:text-blue-700 font-medium text-sm py-2"
              >
                Didn't receive the email? Send again
              </button>
            </>
          )}

          {/* Divider */}
          <div className="my-6 border-t border-gray-200" />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            Logout
          </button>

          {/* Help Text */}
          <p className="text-xs text-gray-500 text-center mt-4">
            💡 Tip: Check your spam folder if you don't see the email
          </p>
        </div>
      </div>
    </div>
  );
}