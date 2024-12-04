import { Link } from "react-router-dom";

type Props = {
  title: string;
  description: string;
  imageUrl: string;
};

const DetailPageComponent: React.FC<Props> = ({
  title,
  description,
  imageUrl,
}) => {
  return (
    <div className="container-lg mt-5">
      <h1 className="display-4">{title}</h1>

      <div className="row mt-4">
        <div className="col-lg-6">
          <img src={imageUrl} className="img-fluid" alt={title} />
        </div>
        <div className="col-lg-6">
          <h2>Popis produktu</h2>
          <p>{description}</p>

          <Link to="/kontakt" className="btn btn-primary mt-3">
            Kontaktujte nás pre cenovú ponuku
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DetailPageComponent;
