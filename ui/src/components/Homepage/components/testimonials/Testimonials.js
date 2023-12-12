import React, { useEffect } from 'react';
import './Testimonials.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import guitar_learner_profile from '../../assets/guitar_learner_profile.jpg';

const Testimonials = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);
  return (
    <section id='feedbacks'>
      <div className="container md:space-y-10 space-y-5">
        <div
          className="w-full mx-auto text-center"
          data-wow-delay=".1s"
          style={{ maxWidth: 570, marginBottom: 100 }}
        >
          <h2 className="mb-4 text-3xl font-bold !leading-tight text-black dark:text-white sm:text-4xl md:text-[45px]">
            What Our Users Say
          </h2>
          <p className="text-base !leading-relaxed text-body-color md:text-lg">
            Our vibrant community ranges from enthusiastic beginners to seasoned pros in both learning and teaching. Hear their diverse experiences, from those just starting their musical journey to expert tutors crafting advanced courses.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          <div className="w-full">
            <div
              className="wow fadeInUp rounded-md bg-white p-8 shadow-one dark:bg-[#1D2144] lg:px-5 xl:px-8"
              data-wow-delay=".1s"
            >
              <div className="mb-5 flex items-center space-x-1">
                <span className="text-yellow">
                  <svg
                    width={18}
                    height={16}
                    viewBox="0 0 18 16"
                    className="fill-current"
                  >
                    <path d="M9.09815 0.361679L11.1054 6.06601H17.601L12.3459 9.59149L14.3532 15.2958L9.09815 11.7703L3.84309 15.2958L5.85035 9.59149L0.595291 6.06601H7.0909L9.09815 0.361679Z" />
                  </svg>
                </span>
                <span className="text-yellow">
                  <svg
                    width={18}
                    height={16}
                    viewBox="0 0 18 16"
                    className="fill-current"
                  >
                    <path d="M9.09815 0.361679L11.1054 6.06601H17.601L12.3459 9.59149L14.3532 15.2958L9.09815 11.7703L3.84309 15.2958L5.85035 9.59149L0.595291 6.06601H7.0909L9.09815 0.361679Z" />
                  </svg>
                </span>
                <span className="text-yellow">
                  <svg
                    width={18}
                    height={16}
                    viewBox="0 0 18 16"
                    className="fill-current"
                  >
                    <path d="M9.09815 0.361679L11.1054 6.06601H17.601L12.3459 9.59149L14.3532 15.2958L9.09815 11.7703L3.84309 15.2958L5.85035 9.59149L0.595291 6.06601H7.0909L9.09815 0.361679Z" />
                  </svg>
                </span>
                <span className="text-yellow">
                  <svg
                    width={18}
                    height={16}
                    viewBox="0 0 18 16"
                    className="fill-current"
                  >
                    <path d="M9.09815 0.361679L11.1054 6.06601H17.601L12.3459 9.59149L14.3532 15.2958L9.09815 11.7703L3.84309 15.2958L5.85035 9.59149L0.595291 6.06601H7.0909L9.09815 0.361679Z" />
                  </svg>
                </span>
                <span className="text-yellow">
                  <svg
                    width={18}
                    height={16}
                    viewBox="0 0 18 16"
                    className="fill-current"
                  >
                    <path d="M9.09815 0.361679L11.1054 6.06601H17.601L12.3459 9.59149L14.3532 15.2958L9.09815 11.7703L3.84309 15.2958L5.85035 9.59149L0.595291 6.06601H7.0909L9.09815 0.361679Z" />
                  </svg>
                </span>
              </div>
              <p className="mb-8 border-b border-body-color border-opacity-10 pb-8 text-base leading-relaxed text-body-color dark:border-white dark:border-opacity-10 dark:text-white">
                “Melodious brought my guitar dreams to life! The lessons are clear, fun, and inspiring. I went from novice to serenading my family in months. The community support here is just amazing.“
              </p>
              <div className="flex items-center">
                <div className="relative mr-4 h-[50px] w-full max-w-[50px] overflow-hidden rounded-full">
                  <img
                    alt="Alex Rivera"
                    // srcSet="/_next/image?url=%2Fimages%2Ftestimonials%2Fauth-01.png&w=640&q=75 640w, /_next/image?url=%2Fimages%2Ftestimonials%2Fauth-01.png&w=750&q=75 750w, /_next/image?url=%2Fimages%2Ftestimonials%2Fauth-01.png&w=828&q=75 828w, /_next/image?url=%2Fimages%2Ftestimonials%2Fauth-01.png&w=1080&q=75 1080w, /_next/image?url=%2Fimages%2Ftestimonials%2Fauth-01.png&w=1200&q=75 1200w, /_next/image?url=%2Fimages%2Ftestimonials%2Fauth-01.png&w=1920&q=75 1920w, /_next/image?url=%2Fimages%2Ftestimonials%2Fauth-01.png&w=2048&q=75 2048w, /_next/image?url=%2Fimages%2Ftestimonials%2Fauth-01.png&w=3840&q=75 3840w"
                    src={guitar_learner_profile}

                    style={{
                      position: 'absolute',
                      height: '100%',
                      width: '100%',
                      left: 0,
                      top: 0,
                      right: 0,
                      bottom: 0,
                      color: 'transparent',
                    }}
                  />
                </div>
                <div className="w-full">
                  <h5 className="mb-1 text-lg font-semibold text-dark dark:text-white lg:text-base xl:text-lg">
                    Alex Rivera
                  </h5>
                  <p className="text-sm text-body-color">Student at some University</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full">
            <div
              className="wow fadeInUp rounded-md bg-white p-8 shadow-one dark:bg-[#1D2144] lg:px-5 xl:px-8"
              data-wow-delay=".1s"
            >
              <div className="mb-5 flex items-center space-x-1">
                <span className="text-yellow">
                  <svg
                    width={18}
                    height={16}
                    viewBox="0 0 18 16"
                    className="fill-current"
                  >
                    <path d="M9.09815 0.361679L11.1054 6.06601H17.601L12.3459 9.59149L14.3532 15.2958L9.09815 11.7703L3.84309 15.2958L5.85035 9.59149L0.595291 6.06601H7.0909L9.09815 0.361679Z" />
                  </svg>
                </span>
                <span className="text-yellow">
                  <svg
                    width={18}
                    height={16}
                    viewBox="0 0 18 16"
                    className="fill-current"
                  >
                    <path d="M9.09815 0.361679L11.1054 6.06601H17.601L12.3459 9.59149L14.3532 15.2958L9.09815 11.7703L3.84309 15.2958L5.85035 9.59149L0.595291 6.06601H7.0909L9.09815 0.361679Z" />
                  </svg>
                </span>
                <span className="text-yellow">
                  <svg
                    width={18}
                    height={16}
                    viewBox="0 0 18 16"
                    className="fill-current"
                  >
                    <path d="M9.09815 0.361679L11.1054 6.06601H17.601L12.3459 9.59149L14.3532 15.2958L9.09815 11.7703L3.84309 15.2958L5.85035 9.59149L0.595291 6.06601H7.0909L9.09815 0.361679Z" />
                  </svg>
                </span>
                <span className="text-yellow">
                  <svg
                    width={18}
                    height={16}
                    viewBox="0 0 18 16"
                    className="fill-current"
                  >
                    <path d="M9.09815 0.361679L11.1054 6.06601H17.601L12.3459 9.59149L14.3532 15.2958L9.09815 11.7703L3.84309 15.2958L5.85035 9.59149L0.595291 6.06601H7.0909L9.09815 0.361679Z" />
                  </svg>
                </span>
                <span className="text-yellow">
                  <svg
                    width={18}
                    height={16}
                    viewBox="0 0 18 16"
                    className="fill-current"
                  >
                    <path d="M9.09815 0.361679L11.1054 6.06601H17.601L12.3459 9.59149L14.3532 15.2958L9.09815 11.7703L3.84309 15.2958L5.85035 9.59149L0.595291 6.06601H7.0909L9.09815 0.361679Z" />
                  </svg>
                </span>
              </div>
              <p className="mb-8 border-b border-body-color border-opacity-10 pb-8 text-base leading-relaxed text-body-color dark:border-white dark:border-opacity-10 dark:text-white">
                “Teaching piano on Melodious has been transformative. It's more than a platform; it's a thriving community where I share my love for music and see my students flourish. Truly gratifying.“
              </p>
              <div className="flex items-center">
                <div className="relative mr-4 h-[50px] w-full max-w-[50px] overflow-hidden rounded-full">
                  <img
                    alt="Devid Weilium"
                    sizes="100vw"
                    src={""}
                    decoding="async"
                    data-nimg="fill"
                    loading="lazy"
                    style={{
                      position: 'absolute',
                      height: '100%',
                      width: '100%',
                      left: 0,
                      top: 0,
                      right: 0,
                      bottom: 0,
                      color: 'transparent',
                    }}
                  />
                </div>
                <div className="w-full">
                  <h5 className="mb-1 text-lg font-semibold text-dark dark:text-white lg:text-base xl:text-lg">
                    Devid Weil
                  </h5>
                  <p className="text-sm text-body-color">Professional piano tutor at Music Institute</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full">
            <div
              className="wow fadeInUp rounded-md bg-white p-8 shadow-one dark:bg-[#1D2144] lg:px-5 xl:px-8"
              data-wow-delay=".1s"
            >
              <div className="mb-5 flex items-center space-x-1">
                <span className="text-yellow">
                  <svg
                    width={18}
                    height={16}
                    viewBox="0 0 18 16"
                    className="fill-current"
                  >
                    <path d="M9.09815 0.361679L11.1054 6.06601H17.601L12.3459 9.59149L14.3532 15.2958L9.09815 11.7703L3.84309 15.2958L5.85035 9.59149L0.595291 6.06601H7.0909L9.09815 0.361679Z" />
                  </svg>
                </span>
                <span className="text-yellow">
                  <svg
                    width={18}
                    height={16}
                    viewBox="0 0 18 16"
                    className="fill-current"
                  >
                    <path d="M9.09815 0.361679L11.1054 6.06601H17.601L12.3459 9.59149L14.3532 15.2958L9.09815 11.7703L3.84309 15.2958L5.85035 9.59149L0.595291 6.06601H7.0909L9.09815 0.361679Z" />
                  </svg>
                </span>
                <span className="text-yellow">
                  <svg
                    width={18}
                    height={16}
                    viewBox="0 0 18 16"
                    className="fill-current"
                  >
                    <path d="M9.09815 0.361679L11.1054 6.06601H17.601L12.3459 9.59149L14.3532 15.2958L9.09815 11.7703L3.84309 15.2958L5.85035 9.59149L0.595291 6.06601H7.0909L9.09815 0.361679Z" />
                  </svg>
                </span>
                <span className="text-yellow">
                  <svg
                    width={18}
                    height={16}
                    viewBox="0 0 18 16"
                    className="fill-current"
                  >
                    <path d="M9.09815 0.361679L11.1054 6.06601H17.601L12.3459 9.59149L14.3532 15.2958L9.09815 11.7703L3.84309 15.2958L5.85035 9.59149L0.595291 6.06601H7.0909L9.09815 0.361679Z" />
                  </svg>
                </span>
                <span className="text-yellow">
                  <svg
                    width={18}
                    height={16}
                    viewBox="0 0 18 16"
                    className="fill-current"
                  >
                    <path d="M9.09815 0.361679L11.1054 6.06601H17.601L12.3459 9.59149L14.3532 15.2958L9.09815 11.7703L3.84309 15.2958L5.85035 9.59149L0.595291 6.06601H7.0909L9.09815 0.361679Z" />
                  </svg>
                </span>
              </div>
              <p className="mb-8 border-b border-body-color border-opacity-10 pb-8 text-base leading-relaxed text-body-color dark:border-white dark:border-opacity-10 dark:text-white">
                “As a busy professional, finding time for violin practice was tough. Melodious changed that with its flexible, on-demand courses. I've improved my skills significantly and even performed at a local event!“
              </p>
              <div className="flex items-center">
                <div className="relative mr-4 h-[50px] w-full max-w-[50px] overflow-hidden rounded-full">
                  <img
                    alt="Lethium Frenci"
                    sizes="100vw"
                    src={""}
                    decoding="async"
                    data-nimg="fill"
                    loading="lazy"
                    style={{
                      position: 'absolute',
                      height: '100%',
                      width: '100%',
                      left: 0,
                      top: 0,
                      right: 0,
                      bottom: 0,
                      color: 'transparent',
                    }}
                  />
                </div>
                <div className="w-full">
                  <h5 className="mb-1 text-lg font-semibold text-dark dark:text-white lg:text-base xl:text-lg">
                    Lethium Frenci
                  </h5>
                  <p className="text-sm text-body-color">Businessman at Company</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
