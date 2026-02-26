// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { supabase } from '../../lib/supabase';
// import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

// export function AuthCallback() {
//   const navigate = useNavigate();
//   const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
//   const [message, setMessage] = useState('Verifying your email...');

//   useEffect(() => {
//     const handleCallback = async () => {
//       try {
//         console.log('🔗 Auth callback triggered');

//         // Get the hash fragment from URL
//         const hashParams = new URLSearchParams(window.location.hash.substring(1));
//         const tokenHash = hashParams.get('token_hash');
//         const type = hashParams.get('type');

//         console.log('📋 Token hash:', tokenHash ? 'Present' : 'Missing');
//         console.log('📋 Type:', type);

//         if (!tokenHash || type !== 'email') {
//           throw new Error('Invalid verification link');
//         }

//         // Verify the token hash
//         console.log('⏳ Verifying token...');
//         const { data, error } = await supabase.auth.verifyOtp({
//           token_hash: tokenHash,
//           type: 'email',
//         });

//         if (error) {
//           console.error('❌ Verification error:', error);
//           throw error;
//         }

//         console.log('✅ Email verified successfully');
//         console.log('👤 User:', data.user?.email);

//         // Update user_profiles table
//         if (data.user) {
//           const { error: updateError } = await supabase
//             .from('user_profiles')
//             .update({
//               email_verified: true,
//               updated_at: new Date().toISOString(),
//             })
//             .eq('id', data.user.id);

//           if (updateError) {
//             console.error('⚠️ Profile update error:', updateError);
//           } else {
//             console.log('✅ Profile updated');
//           }
//         }

//         // Success!
//         setStatus('success');
//         setMessage('Email verified successfully! Redirecting to dashboard...');

//         // Redirect to dashboard after 2 seconds
//         setTimeout(() => {
//           navigate('/dashboard', { replace: true });
//         }, 2000);

//       } catch (error: any) {
//         console.error('❌ Callback error:', error);
//         setStatus('error');
//         setMessage(error.message || 'Verification failed. Please try again.');

//         // Redirect back to verify page after 3 seconds
//         setTimeout(() => {
//           navigate('/verify-account', { replace: true });
//         }, 3000);
//       }
//     };

//     handleCallback();
//   }, [navigate]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         <div className="bg-white rounded-2xl shadow-xl p-8">
//           <div className="text-center">
//             {status === 'loading' && (
//               <>
//                 <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
//                 </div>
//                 <h1 className="text-2xl font-bold text-gray-900 mb-2">
//                   Verifying...
//                 </h1>
//               </>
//             )}

//             {status === 'success' && (
//               <>
//                 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <CheckCircle2 className="w-8 h-8 text-green-600" />
//                 </div>
//                 <h1 className="text-2xl font-bold text-gray-900 mb-2">
//                   Success!
//                 </h1>
//               </>
//             )}

//             {status === 'error' && (
//               <>
//                 <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <AlertCircle className="w-8 h-8 text-red-600" />
//                 </div>
//                 <h1 className="text-2xl font-bold text-gray-900 mb-2">
//                   Verification Failed
//                 </h1>
//               </>
//             )}

//             <p className="text-gray-600 text-sm">{message}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export function AuthCallback() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        console.log("🔗 Email verification callback loaded");

        // Extract token from URL fragment
        const hash = new URLSearchParams(window.location.hash.substring(1));
        const tokenHash = hash.get("token_hash");
        const type = hash.get("type");

        if (!tokenHash || type !== "email") {
          throw new Error("Invalid or expired verification link.");
        }

        console.log("⏳ Verifying token with Supabase...");
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "email",
        });

        if (error) throw error;

        console.log("✅ Email verified:", data.user?.email);

        // ✅ Update your profile table flag
        if (data.user) {
          await supabase
            .from("user_profiles")
            .update({ email_verified: true, updated_at: new Date().toISOString() })
            .eq("id", data.user.id);
        }

        setStatus("success");
        setMessage("Your email is now verified 🎉");
      } catch (err: any) {
        console.error(err);
        setStatus("error");
        setMessage(err.message || "Verification failed. The link may be expired.");
      }
    };

    verifyEmail();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="max-w-md w-full text-center">
        <div className="bg-white shadow-md rounded-xl p-8 border border-gray-200">

          {status === "loading" && (
            <>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex justify-center items-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Verifying...</h2>
              <p className="text-gray-500 mt-2">{message}</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex justify-center items-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Email Verified</h2>
              <p className="text-gray-600 mt-2">
                🎉 Your email has been successfully verified.
                <br />
                You can now close this page and return to the sign-in page.
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex justify-center items-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Verification Failed</h2>
              <p className="text-gray-600 mt-2">
                {message}
                <br />
                You can close this page and try verifying again from the login screen.
              </p>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
