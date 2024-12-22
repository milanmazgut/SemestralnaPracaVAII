import { Link } from "react-router-dom";

type ProductCardProps = {
  image: string;
  title: string;
  description: string;
  link: string;
};

const ProductCardWithImage: React.FC<ProductCardProps> = ({
  image,
  title,
  description,
  link,
}) => {
  return (
    <div className="card h-100 d-flex flex-column">
      <img src={image} className="card-img-top" alt={title} />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{title}</h5>

        <p className="card-text flex-grow-1">{description}</p>

        <Link to={link} className="btn btn-primary mt-auto">
          Viac informácií
        </Link>
      </div>
    </div>
  );
};

export default ProductCardWithImage;
