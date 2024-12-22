import { Link } from "react-router-dom";
import CardWithImage from "../components/CardWithImage";
import useAuthStore from "../zustand/authStore";

type Product = {
  image: string;
  title: string;
  description: string;
  link: string;
};

const products: Product[] = [
  {
    image: "/images/strecha.jpg",
    title: "Strechy",
    description: "Popis produktu 1.",
    link: "/strechy",
  },
  {
    image: "/images/komin.jpg",
    title: "Komíny",
    description: "Popis produktu 2.",
    link: "/kominy",
  },
  {
    image: "/images/ostatne.jpg",
    title: "Iné výrobky",
    description: "Popis produktu 3.",
    link: "/produkty",
  },
];

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

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
          {products.map((product, index) => (
            <CardWithImage
              key={index}
              image={product.image}
              title={product.title}
              description={product.description}
              link={product.link}
            />
          ))}
        </div>
      </div>
      {!isAuthenticated && (
        <div className="container-lg mt-5">
          <hr className="my-4" />
          <p>Pre prístup k správe firmy a skladu sa prosím prihláste.</p>
          <Link className="btn btn-primary btn-lg" to="/login" role="button">
            Prihlásiť sa
          </Link>
        </div>
      )}
    </div>
  );
};

export default HomePage;
