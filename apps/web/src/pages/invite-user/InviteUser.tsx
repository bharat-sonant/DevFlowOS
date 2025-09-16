
import React, { useState } from 'react';


const InviteUser = () => {
  const [email, setEmail] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = (): void => {
    if (email) {
      setIsSubmitted(true);
      console.log('Sending invite to:', email);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
      }, 2000);
    }
  };

  const styles = {
    container: {
      display: 'flex' as const,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      minHeight: '100vh',
      backgroundColor: '#f5f7fa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      padding: '20px'
    },
    formWrapper: {
      backgroundColor: '#ffffff',
      padding: '40px',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '400px',
      textAlign: 'center' as const
    },
    title: {
      fontSize: '24px',
      fontWeight: '600' as const,
      color: '#2d3748',
      marginBottom: '8px',
      margin: '0 0 8px 0'
    },
    subtitle: {
      fontSize: '14px',
      color: '#718096',
      marginBottom: '32px',
      margin: '0 0 32px 0'
    },
    form: {
      display: 'flex' as const,
      flexDirection: 'column' as const,
      gap: '16px'
    },
    inputWrapper: {
      position: 'relative' as const
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      fontSize: '16px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      outline: 'none' as const,
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      backgroundColor: '#ffffff',
      boxSizing: 'border-box' as const
    },
    button: {
      width: '100%',
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: '600' as const,
      color: '#ffffff',
      backgroundColor: '#4299e1',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer' as const,
      transition: 'all 0.2s ease',
      outline: 'none' as const,
      boxSizing: 'border-box' as const
    },
    successMessage: {
      color: '#38a169',
      fontSize: '14px',
      marginTop: '12px',
      fontWeight: '500' as const
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h1 style={styles.title}>Send Invitation</h1>
        <p style={styles.subtitle}>Enter an email address to send an invite</p>
        
        <div style={styles.form}>
          <div style={styles.inputWrapper}>
            <input
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="Enter email address"
              style={styles.input}
              onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                e.target.style.borderColor = '#4299e1';
                e.target.style.boxShadow = '0 0 0 3px rgba(66, 153, 225, 0.1)';
              }}
              onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
              required
            />
          </div>
          
          <button
            type="button"
            onClick={handleSubmit}
            style={styles.button}
            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
              if (!isSubmitted) {
                (e.target as HTMLButtonElement).style.backgroundColor = '#3182ce';
                (e.target as HTMLButtonElement).style.transform = 'translateY(-1px)';
                (e.target as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(66, 153, 225, 0.3)';
              }
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
              if (!isSubmitted) {
                (e.target as HTMLButtonElement).style.backgroundColor = '#4299e1';
                (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                (e.target as HTMLButtonElement).style.boxShadow = 'none';
              }
            }}
            disabled={isSubmitted}
          >
            {isSubmitted ? '✓ Invite Sent!' : 'Send Invite'}
          </button>
        </div>
        
        {isSubmitted && (
          <div style={styles.successMessage}>
            Invitation has been sent successfully!
          </div>
        )}
      </div>
    </div>
  );
};


export default InviteUser;