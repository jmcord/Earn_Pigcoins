import React from "react";

const MyFooter = () => (
  <footer style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }} className='text-center text-lg-start text-muted'>
    <section className='border-bottom'>
      <div className='container text-center text-md-start mt-5'>
        &nbsp;
        <div className='row mt-3'>
          <div className='col-md-3 col-lg-4 col-xl-3 mx-auto mb-4'>
            <h6 className='text-uppercase fw-bold mb-4'>
              <i className='fas fa-gem me-3'></i>ADA-Animal Data Analytics
            </h6>
            <p>
              Accede a los análisis de datos más novedosos y destacados del mercado.
            </p>
          </div>

          <div className='col-md-2 col-lg-2 col-xl-2 mx-auto mb-4'>
            <h6 className='text-uppercase fw-bold mb-4'>Links</h6>
            <p>
              <button className='text-reset' onClick={() => window.open('https://www.linkedin.com/in/jmcordz')}>
                LinkedIn
              </button>
            </p>
            <p>
              <button className='text-reset' onClick={() => window.open('https://github.com/jmcord/')}>
                GitHub
              </button>
            </p>
          </div>
          <div className='col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4'>
            <h6 className='text-uppercase fw-bold mb-4'>Contacto</h6>
            <p>
              <i className='fas fa-envelope me-3'></i>
              ada@gmail.com
            </p>
          </div>
        </div>
      </div>
    </section>

    <div className='text-center p-4 bg-dark text-white' >
      © 2024 Copyright: 
      <button className='text-reset fw-bold text-white' onClick={() => window.open('mailto:jcorderodz@hotmail.com')}>
        jcorderodz@hotmail.com
      </button>
    </div>
  </footer>
);

export default MyFooter;
