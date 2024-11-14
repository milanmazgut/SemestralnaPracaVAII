
type RefCardProps = {
    image: string;
    alt: string;
    text: string;
};

const ReferenceCard : React.FC<RefCardProps>  = ({ image, alt, text }) => {

return (
    <div className="col-lg-4 mb-4">
      <div className="card">
        <img src={image} className="card-img-top" alt={alt} />
        <div className="card-body">
          <p className="card-text">{text}</p>
        </div>
      </div>
    </div>
  );
};

export default ReferenceCard;