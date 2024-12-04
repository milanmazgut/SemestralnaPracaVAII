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
    <div className="col-lg-4 mb-4">
      <div className="card">
        <img src={image} className="card-img-top" alt={title} />
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{description}</p>
          <Link to={link} className="btn btn-primary">
            Viac informácií
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCardWithImage;
