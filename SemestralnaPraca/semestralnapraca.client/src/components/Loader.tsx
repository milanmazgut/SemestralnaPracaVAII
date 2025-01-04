const Loader: React.FC = () => {
  return (
    <div className="container mt-5 text-center">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Načítavam...</span>
      </div>
      <p className="mt-3">Načítavam stránku...</p>
    </div>
  );
};

export default Loader;
