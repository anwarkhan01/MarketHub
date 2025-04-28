import React from "react";

const Contact = () => {
  return (
    <div className="flex-grow bg-[#02010A] text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <p className="text-gray-300 text-lg">We'd love to hear from you</p>
          <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#22007C] to-[#140152]">
            Let's Get In Touch
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#04052E] p-6 rounded-lg border border-[#140152] text-center">
            <h2 className="text-xl font-semibold mb-2">📞 Call Us</h2>
            <a href="tel:+8408852662" className="text-gray-400">
              +91 8408852662
            </a>
          </div>

          <div className="bg-[#04052E] p-6 rounded-lg border border-[#140152] text-center">
            <h2 className="text-xl font-semibold mb-2">📧 Email Us</h2>
            <a href="mailto:anwarkhan84088@gmail.com" className="text-gray-400">
              anwarkhan84088@gmail.com
            </a>
          </div>

          <div className="bg-[#04052E] p-6 rounded-lg border border-[#140152] text-center">
            <h2 className="text-xl font-semibold mb-2">💻 GitHub</h2>
            <a
              href="https://github.com/anwarkhan01" // Replace with your actual GitHub username
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400"
            >
              github.com/anwarkhan01
            </a>
          </div>
        </div>

        <div className="mt-12">
          <form className="bg-[#04052E] p-8 rounded-lg border border-[#140152] max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2 ">Your Name</label>
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full px-4 py-2 rounded-lg bg-[#140152] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#22007C]"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Your Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 rounded-lg  bg-[#140152] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#22007C]"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm mb-2">Your Message</label>
              <textarea
                rows="4"
                placeholder="Message"
                className="w-full px-4 py-2 rounded-lg  bg-[#140152] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#22007C]"
              />
            </div>

            <button
              className="w-full bg-[#22007C] py-2 mt-6 rounded-lg hover:bg-[#140152] transition-all"
              onClick={(e) => e.preventDefault()}
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
