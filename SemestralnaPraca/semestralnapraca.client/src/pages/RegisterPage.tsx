import React, { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';

const RegisterPage : React.FC = () => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

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
              <h3 className="card-title text-center mb-4">Registrácia</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        Meno
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="meno"
                        name="meno"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className='form-label'>Emailová adresa</label>
                        <input
                        type="email"
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

                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">
                          Registrovať sa
                        </button>
                    </div>
                </form>
                </div>
            <div className="card-footer text-center">
              <div className="text-muted">
                Už máte účet? <Link to="/login">Prihláste sa</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
