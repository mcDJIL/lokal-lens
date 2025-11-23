"use client";

import { motion } from "framer-motion";

const TeamSection = () => {
  const teamMembers = [
    {
      name: "Moch Djauharil Ilmi",
      role: "Team Leader",
      image: "/assets/img/team/areal.jpeg"
    },
    {
      name: "Khairunnisa",
      role: "UI/UX Designer",
      image: "/assets/img/team/aca.jpeg"
    },
    {
      name: "Djenar Virgiant Sayyid Nasrullah",
      role: "Front End Developer",
      image: "/assets/img/team/virgi.jpeg"
    },
    {
      name: "Fieza Rausyan Al Ghifari",
      role: "Full Stack Developer",
      image: "/assets/img/team/f.jpeg"
    },
    {
      name: "Muhammad Dio Rizqi Hermawan",
      role: "Backend Developer",
      image: "/assets/img/team/dyo.jpeg"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const memberVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="w-full py-12 sm:py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12 lg:mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-3xl sm:text-4xl lg:text-[36px] font-bold leading-[40px] tracking-[-0.9px] text-[#4A2C2A]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Tim di Balik Lokallens
          </motion.h2>
          <motion.p 
            className="text-base font-normal leading-[26px] text-[#6F5E5D] max-w-[659px] mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Kami adalah sekelompok individu yang bersemangat untuk melestarikan dan merayakan
            kekayaan budaya Indonesia.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 lg:gap-6 justify-items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {teamMembers.map((member, index) => (
            <motion.div 
              key={index}
              className="flex flex-col items-center w-full max-w-[216px]"
              variants={memberVariants}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
            >
              <motion.div 
                className="w-[216px] h-[216px] mb-4 rounded-[32px] overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-top object-cover"
                />
              </motion.div>
              <motion.h3 
                className="text-base font-bold leading-6 text-[#4A2C2A] text-center mb-1"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.5 }}
              >
                {member.name}
              </motion.h3>
              <motion.p 
                className="text-sm font-normal leading-5 text-[#6F5E5D] text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.6 }}
              >
                {member.role}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TeamSection;
