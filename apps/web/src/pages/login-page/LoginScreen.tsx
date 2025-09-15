import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const LoginScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if(!formData.username || !formData.password){
      alert('Please fill both fields')
      return
    }
  navigate("/dashBoard");
   
  };



  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      fontFamily: 'Arial, sans-serif',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0
    }}>
      {/* Left Panel */}
      <div style={{
        flex: '1 1 50%',
        minWidth: '400px',
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        color: 'white',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: '2px solid white',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '2px'
              }}>
                <div style={{
                  width: '4px',
                  height: '4px',
                  background: 'white',
                  borderRadius: '50%'
                }}></div>
                <div style={{
                  width: '4px',
                  height: '4px',
                  background: 'white',
                  borderRadius: '50%'
                }}></div>
                <div style={{
                  width: '4px',
                  height: '4px',
                  background: 'white',
                  borderRadius: '50%'
                }}></div>
                <div style={{
                  width: '4px',
                  height: '4px',
                  background: 'white',
                  borderRadius: '50%'
                }}></div>
              </div>
            </div>
            <span style={{
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}>Task Management</span>
          </div>
        </div>
        
        <div style={{
          textAlign: 'center',
          zIndex: 2,
          maxWidth: '400px'
        }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 300,
            marginBottom: '1rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            margin: '0 0 1rem 0'
          }}>Welcome Friend!</h1>
          <p style={{
            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
            marginBottom: '2rem',
            opacity: 0.9,
            lineHeight: 1.5,
            margin: '0 0 2rem 0'
          }}>
            To keep connected with us please<br />
            login with your personal info
          </p>
        </div>
        
        {/* Decorative shapes */}
        <div style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          top: '10%',
          right: '-50px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '20px',
          transform: 'rotate(45deg)'
        }}></div>
        <div style={{
          position: 'absolute',
          width: '150px',
          height: '150px',
          bottom: '20%',
          left: '-75px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '20px'
        }}></div>
        <div style={{
          position: 'absolute',
          width: '100px',
          height: '100px',
          top: '60%',
          right: '20%',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%'
        }}></div>
      </div>

      {/* Right Panel */}
      <div style={{
        flex: '1 1 50%',
        minWidth: '400px',
        background: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        overflow: 'auto'
      }}>
        <div style={{
          background: 'white',
          padding: 'clamp(2rem, 4vw, 3rem) clamp(1.5rem, 3vw, 2.5rem)',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '500px',
          textAlign: 'center',
          minHeight: 'fit-content'
        }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
            color: '#4facfe',
            marginBottom: '2rem',
            fontWeight: 300,
            margin: '0 0 2rem 0'
          }}>Login</h2>
          
          <p style={{
            color: '#888',
            fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)',
            marginBottom: '2rem',
            margin: '0 0 2rem 0'
          }}>Enter your username and password</p>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <div style={{
              position: 'relative',
              display: 'flex',
              flexDirection:'column',
              alignItems: 'center',
              gap:'20px'
            }}>
            
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: 'clamp(0.8rem, 1.5vw, 1rem) 1rem clamp(0.8rem, 1.5vw, 1rem) 1rem',
                  border: '1px solid #e0e0e0',
                  borderRadius: '25px',
                  background: '#f8f8f8',
                  fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4facfe';
                  e.target.style.background = 'white';
                  e.target.style.boxShadow = '0 0 0 3px rgba(79, 172, 254, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e0e0e0';
                  e.target.style.background = '#f8f8f8';
                  e.target.style.boxShadow = 'none';
                }}
              />

              {/* Password input wrapper */}
<div style={{ position: "relative", width: "100%" }}>
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Password"
    value={formData.password}
    onChange={handleInputChange}
    style={{
      width: "100%",
      padding: "clamp(0.8rem, 1.5vw, 1rem) 3rem clamp(0.8rem, 1.5vw, 1rem) 1rem", // ⬅️ added space on right
      border: "1px solid #e0e0e0",
      borderRadius: "25px",
      background: "#f8f8f8",
      fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
      outline: "none",
      transition: "all 0.3s ease",
      boxSizing: "border-box",
    }}
    onFocus={(e) => {
      e.target.style.borderColor = "#4facfe";
      e.target.style.background = "white";
      e.target.style.boxShadow = "0 0 0 3px rgba(79, 172, 254, 0.1)";
    }}
    onBlur={(e) => {
      e.target.style.borderColor = "#e0e0e0";
      e.target.style.background = "#f8f8f8";
      e.target.style.boxShadow = "none";
    }}
  />

  {/* Eye toggle button */}
  <span
    onClick={() => setShowPassword((prev) => !prev)}
    style={{
      position: "absolute",
      right: "1rem",
      top: "50%",
      transform: "translateY(-50%)", // ⬅️ vertically centers the eye
      cursor: "pointer",
      userSelect: "none",
      fontSize: "1rem",
      color: "#666",
    }}
  >
    {showPassword ? "🙈" : "👁️"}
  </span>
</div>

            </div>
            
            <button 
              onClick={handleSubmit}
              style={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                border: 'none',
                color: 'white',
                padding: 'clamp(0.8rem, 1.5vw, 1rem) 2rem',
                borderRadius: '25px',
                fontWeight: 'bold',
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginTop: '1rem',
                fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
                width: '100%'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'translateY(-2px)';
                target.style.boxShadow = '0 10px 25px rgba(79, 172, 254, 0.3)';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'translateY(0)';
                target.style.boxShadow = 'none';
              }}
            >
              Login
            </button>
          </div>
        </div>
      </div>

      {/* Global styles to remove body margins and ensure full coverage */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body, html {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          overflow: hidden;
        }

        @media (max-width: 1024px) {
          .signup-container {
            flex-direction: column !important;
            height: 100vh !important;
          }
          
          .left-panel {
            flex: 0 0 40vh !important;
            min-width: auto !important;
          }
          
          .right-panel {
            flex: 1 !important;
            min-width: auto !important;
            padding: 1rem !important;
          }
        }

        @media (max-width: 768px) {
          .signup-container {
            flex-direction: column !important;
          }
          
          .left-panel {
            flex: 0 0 35vh !important;
            padding: 1rem !important;
          }
          
          .right-panel {
            flex: 1 !important;
            padding: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginScreen
