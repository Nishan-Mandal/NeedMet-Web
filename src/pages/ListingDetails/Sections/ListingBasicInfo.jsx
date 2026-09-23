import blueTick from '../../../assets/blueTick.svg'
import facebook from '../../../assets/facebook.svg'
import instagram from '../../../assets/instagram.svg'
import linkedin from '../../../assets/linkedin.svg'
import website from '../../../assets/website.svg'
import whatsapp from '../../../assets/whatsapp.svg'
import useInfo from '../../../contexts/infoContext.jsx';
import { getHomeDetails } from '../../../services/firebase/firestore/homeService.js'
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react'

export default function ListingBasicInfo({ listing, className = '' }) {

    const socialIcons = {
        instagram: <img src={instagram} alt="instagram" className='w-9 h-9 max-[768px]:w-8 max-[768px]:h-8 max-[480px]:w-7 max-[480px]:h-7 object-contain transition-transform group-hover:scale-105' loading="lazy" />,
        facebook: <img src={facebook} alt="facebook" className='w-9 h-9 max-[768px]:w-8 max-[768px]:h-8 max-[480px]:w-7 max-[480px]:h-7 object-contain transition-transform group-hover:scale-105' loading="lazy" />,
        website: <img src={website} alt="website" className='w-9 h-9 max-[768px]:w-8 max-[768px]:h-8 max-[480px]:w-7 max-[480px]:h-7 object-contain transition-transform group-hover:scale-105' loading="lazy" />,
        whatsapp: <img src={whatsapp} alt="whatsapp" className='w-9 h-9 max-[768px]:w-8 max-[768px]:h-8 max-[480px]:w-7 max-[480px]:h-7 object-contain transition-transform group-hover:scale-105' loading="lazy" />,
        linkedin: <img src={linkedin} alt="linkedin" className='w-9 h-9 max-[768px]:w-8 max-[768px]:h-8 max-[480px]:w-7 max-[480px]:h-7 object-contain transition-transform group-hover:scale-105' loading="lazy" />
    }

    function formatSocialLink(key, value) {
        if (!value) return "#";

        const clean = value.trim();

        if (key === "whatsapp") {
            let number = clean.replace(/[^\d]/g, "");

            if (number.length === 10) {
            number = "91" + number;
            }

            return `https://wa.me/${number}`;
        }

        if (clean.startsWith("http://") || clean.startsWith("https://")) {
            return clean;
        }

        return `https://${clean}`;
    }

    const renderStars = (count) => {
        const stars = []
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <i
                    key={i}
                    className={`fa-solid fa-star ${i <= count ? 'text-accent-yellow' : 'text-gray-300'}`}
                ></i>
            )
        }
        return stars
    }

    const getOwnerLogo = (fullName) => {
        const parts = fullName.trim().split(/\s+/);

        const firstChar = parts[0] ? parts[0][0] : "";

        if (parts.length === 1) {
            return firstChar.toUpperCase();
        }

        const lastChar = parts[parts.length - 1]
            ? parts[parts.length - 1][0]
            : "";

        return (firstChar + lastChar).toUpperCase();
    };

    const { contactNo, setContactNo } = useInfo();

    const {data: homeData} = useQuery({
        queryKey: ['homeDetails'],
        queryFn: () => getHomeDetails(),
        enabled: !contactNo,
    });

    useEffect (() => {
        if (homeData?.whatsappSupport) {
            setContactNo(homeData.whatsappSupport);
        }
    }, [homeData]);

    const handleHelp = () => {
        if (contactNo) {
            const whatsappLink = `https://wa.me/${contactNo.replace(/[^\d]/g, "")}`;
            window.open(whatsappLink, "_blank");
        }
    };

    return (
        <div className={`bg-surface border border-border shadow-[0_4px_10px_rgba(15,92,63,0.226),0_1px_2px_rgba(0,0,0,0.11)] rounded-[1rem] p-[1.4rem_1.4rem_0] max-[768px]:p-[1.1rem_1.1rem_0] max-[768px]:rounded-[0.9rem] max-[480px]:p-[1rem_1rem_0] max-[480px]:rounded-[0.85rem] flex flex-col gap-[0.85rem] max-[768px]:gap-[0.75rem] max-[480px]:gap-[0.65rem] w-full font-primary ${className}`}>

            <span className='text-[0.92rem] max-[768px]:text-[0.82rem] max-[480px]:text-[0.74rem] font-bold text-primary uppercase tracking-[0.08em] font-heading opacity-85'>{listing.category}</span>

            {/* Title */}
            <h1 className="font-heading font-bold text-[2rem] max-[768px]:text-[1.6rem] max-[480px]:text-[1.35rem] leading-[1.2] max-[480px]:leading-[1.3] text-text-accent capitalize m-0">{listing.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-[0.7rem] max-[480px]:gap-[0.45rem] max-[480px]:flex-wrap">
                <div className="text-[1rem] max-[480px]:text-[0.9rem] flex items-center gap-1">
                    {renderStars(Math.trunc(listing.rating))}
                </div>
                <span className="text-[0.96rem] max-[480px]:text-[0.82rem] text-text-secondary font-primary">
                    <span className="font-bold text-text">{listing.rating} </span>
                    ({listing.reviews} reviews)
                </span>
            </div>

            {/* Location */}
            <div className="flex items-start gap-[0.35rem] text-[0.98rem] max-[480px]:text-[0.85rem] text-text-secondary my-[0.2rem] max-[480px]:my-0 leading-[1.5]">
                <i className="fa-solid fa-location-dot text-primary mt-[0.15rem]"></i>
                <span className="flex items-start">{listing.address}</span>
            </div>

            {/* social */}
            <div className="flex items-center gap-4 max-[768px]:gap-[0.8rem] max-[480px]:gap-[0.7rem] flex-wrap">
                {Object.keys(socialIcons).map((key) => {
                    const value = listing.social[key];

                    return (
                    <a
                        key={key}
                        className={`group transition-transform hover:-translate-y-0.5 ${!value ? "opacity-20 pointer-events-none grayscale" : ""}`}
                        href={formatSocialLink(key, value)}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => !value && e.preventDefault()}
                    >
                        {socialIcons[key]}
                    </a>
                    );
                })}
            </div>

            {/* Description */}
            <div>
                <h4 className="border-t border-border pt-4 pb-[0.45rem] max-[480px]:pt-[0.9rem] max-[480px]:pb-[0.35rem] text-[1rem] max-[480px]:text-[0.92rem] font-bold font-heading text-text m-0">Description</h4>
                <p className="text-[0.95rem] max-[768px]:text-[0.9rem] max-[480px]:text-[0.84rem] text-text-secondary leading-[1.7] max-[480px]:leading-[1.65] font-primary m-0">{listing.description}</p>
            </div>

            {/* Owner */}
            <div className="flex justify-between items-center py-4 max-[480px]:py-[0.9rem] border-t border-border">
                <div className="flex items-center gap-[0.8rem] max-[480px]:gap-[0.65rem]">
                    <div className="w-[52px] h-[52px] max-[768px]:w-[48px] max-[768px]:h-[48px] max-[480px]:w-[42px] max-[480px]:h-[42px] rounded-full bg-gradient-to-br from-primary to-primary-light text-text-on-dark flex items-center justify-center font-bold text-[1.2rem] max-[768px]:text-[1.05rem] max-[480px]:text-[0.95rem] font-heading shrink-0">
                        {getOwnerLogo(listing.ownerName)}
                    </div>

                    <div>
                        <p className="font-bold text-[1rem] max-[768px]:text-[0.95rem] max-[480px]:text-[0.85rem] text-text m-0">{listing.ownerName}</p>
                        <p className="flex items-center gap-[0.3rem] text-[0.78rem] max-[480px]:text-[0.68rem] text-text-secondary m-0 mt-[0.15rem]">
                            Contributor
                            <img src={blueTick} alt="verified" loading="lazy" className="w-3.5 h-3.5" />
                        </p>
                    </div>
                </div>

                <button
                    className="p-[0.65rem_1rem] max-[768px]:p-[0.55rem_0.9rem] max-[480px]:p-[0.5rem_0.7rem] border border-primary/15 bg-primary-surface text-primary rounded-[0.8rem] max-[480px]:rounded-[0.7rem] cursor-pointer hover:bg-primary hover:text-text-on-dark hover:border-primary hover:-translate-y-0.5 transition-all flex items-center gap-[0.45rem] max-[480px]:gap-[0.25rem] text-[1.2rem] max-[768px]:text-[1rem] font-semibold font-primary"
                    onClick={handleHelp}
                    aria-label="Support help"
                >
                    <i className="fa-regular fa-circle-question"></i>
                    <span className="hidden md:inline text-sm font-semibold">Help</span>
                </button>
            </div>

        </div>
    )
}