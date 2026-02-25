import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-900 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Logo */}
        <div className="mb-8 text-center md:text-left">
          <Image src="/image/logo.jpeg" alt="Logo" width={160} height={40} />
        </div>

        {/* Colunas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
          {/* Links rápidos */}
          <div>
            <h4 className="font-semibold mb-3">Links Rápidos</h4>
            <ul className="space-y-2 text-gray-700">
              <li><a href="#" className="hover:text-primary">Home</a></li>
              <li><a href="#" className="hover:text-primary">Produtos</a></li>
              <li><a href="#" className="hover:text-primary">Promoções</a></li>
              <li><a href="#" className="hover:text-primary">Sobre Nós</a></li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-semibold mb-3">Contato</h4>
            <p className="text-gray-700">email@exemplo.com</p>
            <p className="text-gray-700">+55 (83) 99999-9999</p>
            <p className="text-gray-700">Rua Exemplo, 123 - João Pessoa, PB</p>
          </div>

          {/* Redes Sociais */}
          <div>
            <h4 className="font-semibold mb-3">Redes Sociais</h4>
            <div className="flex justify-center md:justify-start space-x-4 text-gray-700">
              <a href="#" className="hover:text-primary"><FaFacebookF /></a>
              <a href="#" className="hover:text-primary"><FaInstagram /></a>
              <a href="#" className="hover:text-primary"><FaTwitter /></a>
            </div>
          </div>
        </div>

        {/* Formas de pagamento */}
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mb-8">
          <span className="text-gray-700 font-semibold text-sm">Pagamentos:</span>

          <Image src="/image/visa.svg" alt="Visa" width={40} height={25} />
          <Image src="/image/mastercard.svg" alt="MasterCard" width={40} height={25} />
        
          <Image src="/image/icons8-pix.svg" alt="Pix" width={40} height={25} />
         
          <Image src="/image/elo-svgrepo-com.svg" alt="Elo" width={40} height={25} />
          <Image src="/image/hipercard-svgrepo-com.svg" alt="Hipercard" width={40} height={25} />
         
        </div>

        {/* Copyright */}
        <div className="text-gray-500 text-sm border-t border-gray-200 pt-4 text-center md:text-left">
          © 2026 DIASCODE. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}