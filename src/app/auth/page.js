'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Eye, EyeOff, Phone, ArrowRight, ChevronLeft } from 'lucide-react';
import styles from './auth.module.css';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Clear error when typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isLogin ? {
          email: form.email,
          password: form.password
        } : form)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Store token and redirect
      localStorage.setItem('varah_token', data.token);
      localStorage.setItem('varah_user', JSON.stringify(data.user));
      
      // Redirect to homepage instead of /account to prevent 404
      router.push('/');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Left — Branding */}
        <div className={styles.brandSide}>
          <Link href="/" className={styles.backLink}>
            <ChevronLeft size={16} /> Back to Home
          </Link>
          <div className={styles.brandContent}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoIcon}>𝕍</span>
              <span className={styles.logoText}>VARAH</span>
            </Link>
            <h1 className={styles.brandTitle}>
              {isLogin ? 'Welcome Back' : 'Join the Family'}
            </h1>
            <p className={styles.brandDesc}>
              {isLogin
                ? 'Sign in to access your orders, wishlist, and exclusive deals.'
                : 'Create an account to discover handcrafted treasures from across India.'
              }
            </p>

            <div className={styles.features}>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>🎁</span>
                <div>
                  <strong>First Order Discount</strong>
                  <span>Get 15% off on your first purchase</span>
                </div>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>💎</span>
                <div>
                  <strong>Exclusive Access</strong>
                  <span>Early access to new collections</span>
                </div>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>🔔</span>
                <div>
                  <strong>Price Drop Alerts</strong>
                  <span>Get notified on wishlist items</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Form */}
        <div className={styles.formSide}>
          <div className={styles.formCard}>
            {/* Toggle */}
            <div className={styles.toggle}>
              <button
                className={`${styles.toggleBtn} ${isLogin ? styles.toggleActive : ''}`}
                onClick={() => setIsLogin(true)}
                id="login-toggle"
              >
                Sign In
              </button>
              <button
                className={`${styles.toggleBtn} ${!isLogin ? styles.toggleActive : ''}`}
                onClick={() => setIsLogin(false)}
                id="signup-toggle"
              >
                Create Account
              </button>
            </div>

            {error && <div className={styles.errorMessage} style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fee2e2', borderRadius: '4px', fontSize: '0.9rem' }}>{error}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Name (signup only) */}
              {!isLogin && (
                <div className={styles.inputGroup}>
                  <User size={18} className={styles.inputIcon} />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className={styles.input}
                    required={!isLogin}
                    id="auth-name"
                  />
                </div>
              )}

              {/* Email */}
              <div className={styles.inputGroup}>
                <Mail size={18} className={styles.inputIcon} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className={styles.input}
                  required
                  id="auth-email"
                />
              </div>

              {/* Phone (signup only) */}
              {!isLogin && (
                <div className={styles.inputGroup}>
                  <Phone size={18} className={styles.inputIcon} />
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className={styles.input}
                    required={!isLogin}
                    id="auth-phone"
                  />
                </div>
              )}

              {/* Password */}
              <div className={styles.inputGroup}>
                <Lock size={18} className={styles.inputIcon} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className={styles.input}
                  required
                  id="auth-password"
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {isLogin && (
                <div className={styles.extras}>
                  <label className={styles.remember}>
                    <input type="checkbox" className={styles.checkbox} /> Remember me
                  </label>
                  <Link href="/forgot-password" className={styles.forgotLink}>
                    Forgot password?
                  </Link>
                </div>
              )}

              {!isLogin && (
                <p className={styles.terms}>
                  By creating an account, you agree to VARAH&apos;s{' '}
                  <Link href="/terms">Terms of Service</Link> and{' '}
                  <Link href="/privacy">Privacy Policy</Link>.
                </p>
              )}

              <button type="submit" disabled={loading} className={`btn btn-primary btn-lg ${styles.submitBtn}`} id="auth-submit-btn">
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            {/* Divider */}
            <div className={styles.divider}>
              <span>or continue with</span>
            </div>

            {/* Social Login */}
            <div className={styles.socials}>
              <button className={styles.socialBtn} id="google-login-btn">
                <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </button>
              <button className={styles.socialBtn} id="facebook-login-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
              <button className={styles.socialBtn} id="instagram-login-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#E4405F">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
                Instagram
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
