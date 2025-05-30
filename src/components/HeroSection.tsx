import logo from "../assets/mimini-logo.svg";
import bgBottom from "../assets/bg.svg";
import arrow from "../assets/arrow.svg";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import confetti from "canvas-confetti";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const HeroSection = () => {
  const [formData, setFormData] = useState({ recipient: "" });
  const [errors, setErrors] = useState<{ recipient?: string }>({});
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Invalid email address";
    return "";
  };

  // 🔍 Move validation logic outside
  const validateForm = () => {
    const newErrors: { recipient?: string } = {};
    const emailError = validateEmail(formData.recipient);

    if (emailError) {
      newErrors.recipient = emailError;
    }

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Optional: validate on change
    const fieldError = validateEmail(value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBackendError("");
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${BASE_URL}/WaitLists/joinWaitList`, {
        email: formData.recipient,
      });

      //   console.log("Submitted email:", response.data);

      setShowModal(true);

      confetti({
        particleCount: 200,
        startVelocity: 35,
        spread: 150,
        origin: { y: 0.7 },
      });

      // Reset form
      setFormData({ recipient: "" });
      setErrors({});
      return response.data;
    } catch (e) {
      const error = e as AxiosError<{ message: string }> | Error;
      const errorMessage =
        ("response" in error && error.response?.data?.message) ||
        error.message ||
        "An error occurred. Please try again.";
      setBackendError(errorMessage);
      //   console.error("Submission error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormInvalid =
    Object.values(errors).some((error) => error) || !formData.recipient.trim();

  useEffect(() => {
    console.log("Form data changed:", isFormInvalid);
  }, [formData]);

  return (
    <>
      <div className="w-full relative z-20 h-screen bg-[#000] overflow-hidden">
        <div>
          <div className="w-full md:pt-[50px] pt-[30px] px-4 sm:px-6 md:px-8 lg:px-10 max-w-[1220px] mx-auto relative z-20">
            <div className="flex justify-between items-center bg-[#000] text-white">
              <button className="cursor-pointer">
                <img
                  src={logo}
                  alt="Mimoni logo"
                  className="w-[120px] sm:w-[120px] md:w-[150px]  h-auto object-contain"
                />
              </button>

              <div className="flex gap-4 items-center justify-between">
                <a href="https://instagram.com/mimonihq" target="_blank">
                  <FaInstagram className="text-[20px] sm:text-[25px]" />
                </a>
                <a href="https://x.com/mimonihq" target="_blank">
                  <FaXTwitter className="text-[20px] sm:text-[25px]" />
                </a>
                <a
                  href="https://www.linkedin.com/company/mimonihq"
                  target="_blank"
                >
                  <FaLinkedin className="text-[20px] sm:text-[25px]" />
                </a>
              </div>
            </div>
          </div>

          <div className="flex relative z-20 flex-col   justify-center  items-center text-center  h-[calc(100vh-100px)] md:h-[calc(100vh-160px)] w-full ">
            <p className="text-[15px] text-[#BABABA]  mb-2">
              🔥 Receive & Send money on your terms.
            </p>
            <h1 className="text-transparent bg-clip-text  md:leading-[3.4rem] leading-[2.5rem] lg:leading-[4.5rem]  bg-gradient-to-r from-white to-[#8A8A8A] lg:text-[59px]  md:text-[49px] sm:text-[35px] text-[30px] font-[700]">
              Join The Waitlist for <br /> Mimoni Today!
            </h1>
            <p className="text-[15px] text-[#BABABA] lg:w-[45%] md:w-[60%] w-full px-[10px] md:px-0 ">
              We believe everyone has the right to when and how they want to
              send or receive money, so we built Mimoni, a platform that allows
              you to send or receive money on your own terms.
            </p>

            <div className="w-full flex items-center md:mt-[1rem] lg:mt-0  justify-center   ">
              <form
                onSubmit={handleSubmit}
                className="w-full  px-[15px]  md:w-[55%] lg:w-[40%] relative mt-8"
              >
                <div className="flex flex-col sm:flex-col  lg:flex-row justify-between items-center w-full gap-4 lg:gap-2">
                  <input
                    type="email"
                    placeholder="Your email address"
                    name="recipient"
                    value={formData.recipient}
                    onChange={handleChange}
                    className={`p-[11px] pl-5 pr-3 border text-[#BABABA] placeholder-[#BABABA] text-[15px] bg-[#59595999] border-[#59595999] w-full outline-none rounded-[10px] ${
                      errors.recipient ? "border-red-500" : ""
                    }`}
                  />

                  <button
                    disabled={isFormInvalid}
                    className={`bg-[#fff] min-w-[140px] w-full   lg:w-[27%] py-[11px] px-4 rounded-[10px] text-black text-[15px] whitespace-nowrap ${
                      isFormInvalid ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                  >
                    {isSubmitting ? "Submitting..." : "Join Waitlist"}
                  </button>

                  <img
                    className="hidden md:block absolute right-[-5rem] bottom-[8px]"
                    src={arrow}
                    alt=""
                  />
                </div>

                {backendError && (
                  <p className="text-red-500 text-sm mt-1">{backendError}</p>
                )}
              </form>
            </div>
          </div>
        </div>
        <img
          src={bgBottom}
          className="absolute bottom-0 left-0 w-full h-auto object-cover z-0"
          alt=""
        />
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/90 bg-opacity-60 z-50 flex justify-center items-center">
          <div className="bg-[#797575]/40 backdrop-blur-sm p-8 rounded-lg text-center md:max-w-md max-w-[400px] shadow-lg">
            <div className="flex items-center justify-center ">
              <span className="text-[30px] mb-4">🎉</span>
              <h2 className="text-[30px] font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-[#8A8A8A]">
                Thanks for joining!
              </h2>
            </div>
            <p className=" text-[#BABABA] mb-6">
              Woohoo! You're in! 🥳 We’re thrilled to have you on board, watch
              your inbox for something cool!
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-white text-black cursor-pointer px-6 py-2 rounded-[10px] transition"
            >
              Close Popup
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HeroSection;
