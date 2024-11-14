
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <div className="container-lg mt-5">
        <h1 className="display-4">Vitajte na našej stránke!</h1>
        <p className="lead">
          Nájdete tu profesionálne klampiarske služby a kvalitné produkty.
        </p>
      </div>

      <div className="container-lg mt-5">
        <h2>Naša ponuka</h2>
        <div className="row">
          {/* Karta 1 */}
          <div className="col-lg-4 mb-4">
            <div className="card">
              <img src="/images/strecha.jpg" className="card-img-top" alt="Strecha" />
              <div className="card-body">
                <h5 className="card-title">Strechy</h5>
                <p className="card-text">Popis produktu 1.</p>
                <Link to="/strechy" className="btn btn-primary">
                  Viac informácií
                </Link>
              </div>
            </div>
          </div>
          {/* Karta 2 */}
          <div className="col-lg-4 mb-4">
            <div className="card">
              <img src="/images/komin.jpg" className="card-img-top" alt="Komín" />
              <div className="card-body">
                <h5 className="card-title">Komíny</h5>
                <p className="card-text">Popis produktu 2.</p>
                <Link to="/komin" className="btn btn-primary">
                  Viac informácií
                </Link>
              </div>
            </div>
          </div>
          {/* Karta 3 */}
          <div className="col-lg-4 mb-4">
            <div className="card">
              <img src="/images/ostatne.jpg" className="card-img-top" alt="Iné" />
              <div className="card-body">
                <h5 className="card-title">Iné výrobky</h5>
                <p className="card-text">Popis produktu 3.</p>
                <Link to="/produkty" className="btn btn-primary">
                  Viac informácií
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-lg mt-5">
        <hr className="my-4" />
        <p>Pre prístup k správe firmy a skladu sa prosím prihláste.</p>
        <Link className="btn btn-primary btn-lg" to="/login" role="button">
          Prihlásiť sa
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
