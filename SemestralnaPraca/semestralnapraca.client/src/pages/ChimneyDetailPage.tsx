import { Link } from 'react-router-dom';
import ReferenceCard from '../components/ReferenceCard';


type Reference = {
    id: number;
    image: string;
    alt: string;
    text: string;
  };


const references : Reference[] = [
{
    id: 1,
    image: '/images/komin1.jpg',
    alt: 'Referencie oplechovanie komína 1',
    text: 'Oplechovanie komína pre rodinný dom v Terchovej.',
},
{
    id: 2,
    image: '/images/komin2.jpg',
    alt: 'Referencie oplechovanie komína 2',
    text: 'Oplechovanie komína pre rodinný dom v Terchovej.',
},
{
    id: 3,
    image: '/images/komin3.jpg',
    alt: 'Referencie oplechovanie komína 3',
    text: 'Oplechovanie komína pre rodinný dom v Terchovej.',
},
];

const ChimneyDetailPage: React.FC = () => {

  return (
    <div className="container-lg mt-5">
      <h1 className="display-4">Komíny - Oplechovanie</h1>
      <p className="lead">
        Ponúkame profesionálne oplechovanie komínov, ktoré zabezpečí ochranu proti poveternostným vplyvom a estetický
        vzhľad vášho komína.
      </p>

      <div className="row mt-4">
        <div className="col-lg-6">
          <img src='/images/komin.jpg' className="img-fluid" alt="Oplechovanie komína" />
        </div>
        <div className="col-lg-6">
          <h2>Popis produktu</h2>
          <p>
            Naše oplechovanie komínov je navrhnuté s ohľadom na dlhodobú odolnosť a estetiku. Používame kvalitné
            materiály, ktoré poskytujú ochranu proti zatekaniu a korózii. Naše riešenia sú vhodné pre rodinné domy aj
            komerčné objekty a zabezpečujú dlhodobú ochranu komína.
          </p>
          <h3>Vlastnosti</h3>
          <ul>
            <li>Ochrana proti poveternostným vplyvom</li>
            <li>Odolné voči korózii</li>
            <li>Estetický vzhľad</li>
            <li>Jednoduchá montáž a údržba</li>
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
            text={ref.text} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChimneyDetailPage;
