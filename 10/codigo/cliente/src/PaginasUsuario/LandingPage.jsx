// src/ComponentesGeneral/LandingPage.jsx

import React, { useState } from "react";
import "./LandingPage.css";
import { Link } from "react-router-dom";

// Iconos para testimonios y estrellas
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Datos de los testimonios adaptados
const todosLosTestimonios = [
  {
    id: 1,
    texto: "SportSync me ha permitido gestionar las reservas de mis canchas sin complicaciones. Ahora todo es rápido y ordenado.",
    autor: "Carlos Gutiérrez",
    ciudad: "Lima",
    rating: 5,
    iconoComponente: FaQuoteLeft
  },
  {
    id: 2,
    texto: "Gracias a SportSync, los usuarios pueden reservar y pagar desde sus teléfonos. Mi negocio ha mejorado notablemente.",
    autor: "María Quispe",
    ciudad: "Arequipa",
    rating: 5,
    iconoComponente: FaQuoteLeft
  },
  {
    id: 3,
    texto: "Como usuario, me encanta poder reservar canchas en segundos y recibir la confirmación al instante. Muy práctico.",
    autor: "Javier Ramos",
    ciudad: "Trujillo",
    rating: 5,
    iconoComponente: FaQuoteLeft
  },
  {
    id: 4,
    texto: "SportSync me ha ayudado a evitar cruces de horarios y mejorar la atención en mi complejo deportivo.",
    autor: "Luis Fernández",
    ciudad: "Cusco",
    rating: 5,
    iconoComponente: FaQuoteLeft
  },
  {
    id: 5,
    texto: "Con SportSync los pagos son seguros y rápidos. Es una plataforma confiable y muy fácil de usar.",
    autor: "Paola Chávez",
    ciudad: "Piura",
    rating: 5,
    iconoComponente: FaQuoteLeft
  },
  {
    id: 6,
    texto: "La plataforma me permitió llevar un mejor control de mis ingresos y aumentar la cantidad de reservas.",
    autor: "José Martínez",
    ciudad: "Chiclayo",
    rating: 5,
    iconoComponente: FaQuoteLeft
  },
  {
    id: 7,
    texto: "Como administrador de una academia, ahora puedo organizar horarios y espacios con total facilidad.",
    autor: "Rocío Herrera",
    ciudad: "Tacna",
    rating: 5,
    iconoComponente: FaQuoteLeft
  },
  {
    id: 8,
    texto: "SportSync ha hecho que las municipalidades puedan gestionar de forma ordenada sus espacios deportivos.",
    autor: "Álvaro Paredes",
    ciudad: "Iquitos",
    rating: 5,
    iconoComponente: FaQuoteLeft
  },
  {
    id: 9,
    texto: "Lo que más destaco es la facilidad de uso y la rapidez con la que los usuarios pueden hacer sus reservas.",
    autor: "Diana López",
    ciudad: "Huancayo",
    rating: 5,
    iconoComponente: FaQuoteLeft
  },
  {
    id: 10,
    texto: "He logrado aumentar la ocupación de mis canchas gracias a la eficiencia que me ofrece SportSync.",
    autor: "Fernando Vega",
    ciudad: "Pucallpa",
    rating: 5,
    iconoComponente: FaQuoteLeft
  }
];

// Componente para renderizar las estrellas de calificación
const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <FaStar key={i} className={i < rating ? "star-filled" : "star-empty"} />
    );
  }
  return <div className="star-rating">{stars}</div>;
};

function LandingPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonialsPerPage = 2;

  const nextTestimonials = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + testimonialsPerPage;
      return newIndex >= todosLosTestimonios.length ? 0 : newIndex;
    });
  };

  const prevTestimonials = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - testimonialsPerPage;
      return newIndex < 0 ? Math.max(0, todosLosTestimonios.length - testimonialsPerPage) : newIndex;
    });
  };

  const actualStartIndex = Math.max(0, Math.min(currentIndex, todosLosTestimonios.length - testimonialsPerPage));

  const testimoniosVisibles = todosLosTestimonios.slice(
    actualStartIndex,
    actualStartIndex + testimonialsPerPage
  );

  return (
    <div className="landing-page-container">
      <header className="hero-section text-center text-white">
        <div className="container px-4 px-lg-5">
          <h1 className="hero-title display-4 fw-bolder mb-3">
            Reserva y gestiona tus canchas deportivas con SportSync
          </h1>
          <p className="hero-subtitle lead mb-5">
            En Perú, el deporte crece y SportSync te ayuda a llevar tu negocio al siguiente nivel.
            Digitaliza tus reservas, optimiza tus horarios y mejora la experiencia de tus clientes.
          </p>
          <div className="hero-buttons d-grid gap-3 d-sm-flex justify-content-sm-center">
            <Link
              className="btn btn-primary btn-lg px-4 me-sm-3 custom-btn-primary"
              to="/register/usuario"
            >
              Regístrate como Usuario
            </Link>
            <Link
              to="/register/entidad"
              className="btn btn-outline-light btn-lg px-4 custom-btn-outline"
            >
              Regístrate como Entidad
            </Link>
          </div>
        </div>
      </header>

      <section className="testimonials-section py-5">
        <div className="container px-4 px-lg-5 my-5">
          <div className="text-center mb-5">
            <h2 className="section-title fw-bolder">Testimonios de nuestros clientes en Perú</h2>
          </div>

          <div className="testimonials-carousel-container">
            {todosLosTestimonios.length > testimonialsPerPage && (
              <button
                onClick={prevTestimonials}
                className="carousel-arrow prev-arrow"
                aria-label="Anterior testimonio"
                disabled={actualStartIndex === 0}
              >
                <FaChevronLeft />
              </button>
            )}

            <div className="row gx-5 justify-content-center testimonials-row">
              {testimoniosVisibles.map((testimonio) => {
                const IconoTestimonio = testimonio.iconoComponente || FaQuoteLeft;
                return (
                  <div className="col-lg-5 mb-5 testimonial-col" key={testimonio.id}>
                    <div className="card testimonial-card h-100 shadow border-0">
                      <div className="card-body p-4">
                        <StarRating rating={testimonio.rating} />
                        <div className="d-flex align-items-start mt-3">
                          <div className="flex-shrink-0 icon-container">
                            <IconoTestimonio className="testimonial-icon-default" />
                          </div>
                          <div className="ms-4">
                            <p className="testimonial-text mb-1">
                              {testimonio.texto}
                            </p>
                            <div className="testimonial-author small text-muted">
                              - {testimonio.autor}, {testimonio.ciudad}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {todosLosTestimonios.length > testimonialsPerPage && (
              <button
                onClick={nextTestimonials}
                className="carousel-arrow next-arrow"
                aria-label="Siguiente testimonio"
                disabled={actualStartIndex >= todosLosTestimonios.length - testimonialsPerPage}
              >
                <FaChevronRight />
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
