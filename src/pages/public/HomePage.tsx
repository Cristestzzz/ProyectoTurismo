
import { Footer, Features, HeroSection, Header, Locations, FeaturedActivities, MadreDeDiosSection } from '../../components/layout';
import { useState } from 'react';

function HomePage() {
  const [user, setUser] = useState<any>(null);

  // Datos para las features que coinciden con la imagen
  const featuresData = {
    mainTitle: "",
    items: [
      {
        title: "Atención al cliente",
        subtitle: "Ininterrumpida",
        description: "Sin importar la zona horaria, estamos aquí para ayudarte.",
        icon: "fa-solid fa-headset"
      },
      {
        title: "Gana recompensas",
        subtitle: "",
        description: "Explora, gana, canjea y repite con nuestro programa de fidelidad.",
        icon: "fa-solid fa-gift"
      },
      {
        title: "Millones de opiniones",
        subtitle: "",
        description: "Planifica y reserva con confianza gracias a las opiniones de otros viajeros.",
        icon: "fa-solid fa-comments"
      },
      {
        title: "Planifica a tu manera",
        subtitle: "",
        description: "Mantén la flexibilidad con la cancelación gratuita y la opción de reservar ahora y pagar después sin coste adicional.",
        icon: "fa-solid fa-calendar-check"
      }
    ]
  };

  // Renderizado condicional según el rol
  const isOperador = user?.es_operador === true;

  return (
    <div className="app-container">
      <Header isHomePage={true} onUserLoaded={setUser} />
      {isOperador ? (
        <div style={{padding: '3rem 2rem', textAlign: 'center'}}>
          <h2>Bienvenido operador turístico</h2>
          <p>Accede a tus herramientas de gestión, anuncios y reservas.</p>
          {/* Aquí puedes renderizar componentes exclusivos para operadores */}
        </div>
      ) : (
        <>
          <HeroSection
            images={[
              "https://live.staticflickr.com/8266/8746178810_7cf99099c1_h.jpg",
              "https://live.staticflickr.com/3751/8973127846_c09e43054b_k.jpg",
              "https://live.staticflickr.com/5489/9387084053_983025f3d6_h.jpg"
            ]}
          />
          <Features mainTitle={featuresData.mainTitle} items={featuresData.items} />
          <Locations />
          <MadreDeDiosSection />
          <FeaturedActivities />
        </>
      )}
      <Footer companyName="Turismoo verde" year={2025} />
    </div>
  );
}

export default HomePage;
