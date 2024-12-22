import { Link } from "react-router-dom";
import useAuthStore from "../zustand/authStore";

type ProductCardProps = {
  id: number;
  image: string;
  title: string;
  description: string;
  link: string;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
};

const ProductCardWithImage: React.FC<ProductCardProps> = ({
  id,
  image,
  title,
  description,
  link,
  onEdit,
  onDelete,
}) => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "Admin";

  return (
    <div className="card h-100 d-flex flex-column">
      <img src={image} className="card-img-top" alt={title} />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{title}</h5>
        <p className="card-text flex-grow-1">{description}</p>

        {isAdmin ? (
          <div className="d-flex justify-content-between align-items-center">
            <Link to={link} className="btn btn-primary mb-2">
              Viac informácií
            </Link>
            <div>
              <button
                className="btn btn-outline-secondary me-2"
                onClick={() => onEdit && onEdit(id)}
              >
                <i className="bi bi-pencil-square"></i>
              </button>
              <button
                className="btn btn-outline-danger"
                onClick={() => onDelete && onDelete(id)}
              >
                <i className="bi bi-trash3-fill"></i>
              </button>
            </div>
          </div>
        ) : (
          <Link to={link} className="btn btn-primary mb-2">
            Viac informácií
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProductCardWithImage;
