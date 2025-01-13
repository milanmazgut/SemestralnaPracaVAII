import React, { useState } from "react";
import axios from "axios";

const ContactSection: React.FC = () => {
  // Lokálny stav pre polia formulára
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const mess = {
        fullName: fullname,
        email: email,
        phone: phone,
        subject: subject,
        message: message,
      };

      const response = await axios.post("/api/ContactMessage/add", mess);
      if (response.status === 200) {
        setSuccessMsg("Správa bola úspešne odoslaná!");
        setFullname("");
        setEmail("");
        setPhone("");
        setSubject("");
        setMessage("");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (error) {
      setErrorMsg("Nepodarilo sa odoslať správu.");
      console.error("Chyba pri odosielaní správy:", error);
    }
  };

  return (
    <section className="contact-section py-3 py-md-5 py-xl-8">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="card border border-dark rounded shadow-sm overflow-hidden">
              <div className="card-body p-0">
                <div className="row gy-3 gy-md-4 gy-lg-0">
                  <div className="col-12 col-lg-6 contact-left-col d-flex align-items-center">
                    <div className="p-4 p-xl-5 w-100 text-light">
                      <h2 className="h1 mb-3">Ozvite sa nám</h2>
                      <p className="lead fs-4 opacity-75 mb-4 mb-xxl-5">
                        Neustále hľadáme nové príležitosti a spolupráce. Ak máte
                        záujem o spoluprácu, neváhajte nás kontaktovať jedným z
                        nasledujúcich spôsobov.
                      </p>

                      <div className="d-flex mb-4 mb-xxl-5">
                        <i className="bi bi-geo-alt-fill fs-4 text-primary me-4"></i>
                        <div>
                          <h4 className="mb-3">Adresa</h4>
                          <address className="mb-0 opacity-75">
                            Terchová
                            <br />
                            Vyšne Kamence
                          </address>
                        </div>
                      </div>

                      <div className="row mb-4 mb-xxl-5">
                        <div className="col-12 col-xxl-6">
                          <div className="d-flex mb-4 mb-xxl-0">
                            <i className="bi bi-telephone-outbound-fill fs-4 text-primary me-4"></i>
                            <div>
                              <h4 className="mb-3">Telefón</h4>
                              <p className="mb-0">
                                <a
                                  className="link-light link-opacity-75 link-opacity-100-hover text-decoration-none"
                                  href="tel:+421915535758"
                                >
                                  +421 915 535 758
                                </a>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-xxl-6">
                          <div className="d-flex">
                            <i className="bi bi-envelope-at-fill fs-4 text-primary me-4"></i>
                            <div>
                              <h4 className="mb-3">E-mail</h4>
                              <p className="mb-0">
                                <a
                                  className="link-light link-opacity-75 link-opacity-100-hover text-decoration-none"
                                  href="mailto:klampiarkske.prace@gmail.com"
                                >
                                  klampiarkske.prace@gmail.com
                                </a>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex">
                        <i className="bi bi-alarm-fill fs-4 text-primary me-4"></i>
                        <div>
                          <h4 className="mb-3">Otváracie hodiny</h4>
                          <div className="d-flex mb-1">
                            <p className="fw-bold mb-0 me-5">Po - Pia</p>
                            <p className="opacity-75 mb-0">9:00 - 17:00</p>
                          </div>
                          <div className="d-flex">
                            <p className="fw-bold mb-0 me-5">So - Ne</p>
                            <p className="opacity-75 mb-0">9:00 - 14:00</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-lg-6">
                    <div className="row align-items-lg-center h-100">
                      <div className="col-12">
                        <form onSubmit={handleFormSubmit}>
                          <div className="row gy-4 gy-xl-5 p-4 p-xl-5">
                            {successMsg && (
                              <div className="alert alert-success">
                                {successMsg}
                              </div>
                            )}
                            {errorMsg && (
                              <div className="alert alert-danger">
                                {errorMsg}
                              </div>
                            )}

                            <div className="col-12">
                              <label htmlFor="fullname" className="form-label">
                                Celé meno <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="fullname"
                                name="fullname"
                                required
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                              />
                            </div>

                            <div className="col-12 col-md-6">
                              <label htmlFor="email" className="form-label">
                                E-mail <span className="text-danger">*</span>
                              </label>
                              <div className="input-group">
                                <span className="input-group-text">
                                  <i className="bi bi-envelope"></i>
                                </span>
                                <input
                                  type="email"
                                  className="form-control"
                                  id="email"
                                  name="email"
                                  required
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                />
                              </div>
                            </div>

                            <div className="col-12 col-md-6">
                              <label htmlFor="phone" className="form-label">
                                Telefón
                              </label>
                              <div className="input-group">
                                <span className="input-group-text">
                                  <i className="bi bi-telephone"></i>
                                </span>
                                <input
                                  type="tel"
                                  className="form-control"
                                  id="phone"
                                  name="phone"
                                  value={phone}
                                  onChange={(e) => setPhone(e.target.value)}
                                />
                              </div>
                            </div>

                            <div className="col-12">
                              <label htmlFor="subject" className="form-label">
                                Predmet <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="subject"
                                name="subject"
                                required
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                              />
                            </div>

                            <div className="col-12">
                              <label htmlFor="message" className="form-label">
                                Správa <span className="text-danger">*</span>
                              </label>
                              <textarea
                                className="form-control"
                                id="message"
                                name="message"
                                rows={3}
                                required
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                              ></textarea>
                            </div>

                            <div className="col-12">
                              <div className="d-grid">
                                <button
                                  className="btn btn-primary btn-lg"
                                  type="submit"
                                >
                                  Odoslať správu
                                </button>
                              </div>
                            </div>
                          </div>
                          {/* row gy-4 ... */}
                        </form>
                      </div>
                      {/* col-12 */}
                    </div>
                    {/* row */}
                  </div>
                  {/* col-12 col-lg-6 */}
                </div>
                {/* row */}
              </div>
              {/* card-body */}
            </div>
            {/* card */}
          </div>
          {/* col-12 */}
        </div>
        {/* row */}
      </div>
      {/* container */}
    </section>
  );
};

export default ContactSection;
