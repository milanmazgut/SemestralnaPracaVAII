import React, { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';

const LoginPage : React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    // login logic
    
   
  };

  return (
    <div className="container-lg">
      <div className="row justify-content-center align-items-center vh-100">
        <div className="col-lg-5 col-xl-4" >
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Prihlásenie</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className='form-label'>Email alebo používateľské meno</label>
                        <input
                        type="text"
                        id="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className='form-label'>Heslo</label>
                        <input
                        type="password"
                        id="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        />
                    </div>

                    <div className="d-flex justify-content-between mb-3">
                        <div className='form-check'>
                            <input
                            type="checkbox"
                            className='form-check-input'
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="rememberMe">
                                Zapamätať si ma
                            </label>
                        </div>
                        <Link to="/forgot-password" className="text-decoration-none">
                            Zabudnuté heslo?
                        </Link>
                    </div>

                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">
                            Prihlásiť sa
                        </button>
                    </div>
                </form>
                </div>
            <div className="card-footer text-center">
              <div className="text-muted">
                Nemáte účet? <Link to="/register">Registrovať sa</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
