import { Link } from "react-router-dom";
import ReferenceCard from "../components/ReferenceCard";

type Reference = {
    id: number;
    image: string;
    alt: string;
    text: string;
  };

const references : Reference[] = [
    {
      id: 1,
      image: '/images/ref1.jpg',
      alt: 'Referencie 1',
      text: 'Prefa šablóny na rodinnom dome.',
    },
    {
      id: 2,
      image: '/images/ref2.jpg',
      alt: 'Referencie 2',
      text: 'Falcovaná strecha na rodinnom dome.',
    },
    {
      id: 3,
      image: '/images/ref3.jpg',
      alt: 'Referencie 3',
      text: 'Kombinácia falcovanej strechy a šablón.',
    },


  ];

const RoofDetailPage: React.FC = () => {
return (
    <div className="container-lg mt-5">
      <h1 className="display-4">Strechy</h1>
      <p className="lead">
          Naše profesionálne klampiarske riešenia pre strechy zahŕňajú vysoko kvalitné materiály a odbornosť, ktorá
          zabezpečí odolnosť a estetiku vašej strechy.
      </p>

      <div className="row mt-4">
          <div className="col-lg-6">
          <img src="/images/strecha.jpg" className="img-fluid" alt="Strecha" />
          </div>
          <div className="col-lg-6">
          <h2>Popis produktu</h2>
          <p>
              Naše strechy poskytujú maximálnu ochranu proti poveternostným vplyvom a sú navrhnuté tak, aby odolávali aj
              tým najširším teplotným výkyvom. Ponúkame širokú škálu možností, vrátane rôznych druhov krytín, čiže farby a
              štruktúry, ktoré zodpovedajú vašim požiadavkám.
          </p>
          <h3>Vlastnosti</h3>
          <ul>
              <li>Odolné voči poveternostným podmienkam</li>
              <li>Dlhodobá životnosť</li>
              <li>Jednoduchá úprava a údržba</li>
              <li>Esteticky príjemný vzhľad</li>
          </ul>
          <Link to="/kontakt" className="btn btn-primary mt-3">
              Kontaktujte nás pre cenovú ponuku
          </Link>
          </div>
      </div>

      <div className="row mt-5">
      <h2>Referencie</h2>
      <div className="row">
        {references.map((ref) => (
          <ReferenceCard
            key={ref.id}
            image={ref.image}
            alt={ref.alt}
            text={ref.text}
          />
        ))}
      </div>
      </div>
    </div>
  );
};

export default RoofDetailPage;