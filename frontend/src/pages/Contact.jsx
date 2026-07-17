export default function Contact() {
  return (
    <div className="card contact-page">
      <h2>Contact us</h2>
      <p className="meta">Questions about LandChain Registry? Reach out directly.</p>

      <dl className="contact-list">
        <div>
          <dt>Name</dt>
          <dd>Bhargav Nath</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>
            <a href="mailto:nathbhargav92@gmail.com">nathbhargav92@gmail.com</a>
          </dd>
        </div>
        <div>
          <dt>WhatsApp</dt>
          <dd>
            <a
              href="https://wa.me/918133860749"
              target="_blank"
              rel="noreferrer"
            >
              +91 81338 60749
            </a>
          </dd>
        </div>
      </dl>
    </div>
  );
}
