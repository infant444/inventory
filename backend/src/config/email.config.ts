import Mailgen from "mailgen";

export const MailConfig={
    service:'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    family: 4,
    auth:{
        user:process.env.MAIL!,
        pass:process.env.MAIL_PASS!,
    },
    tls: {
        rejectUnauthorized: false
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000
}
export const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: 'ABC Company',
      link: 'http://localhost:4200',
      logo: "https://res.cloudinary.com/dftvthudb/image/upload/v1744654813/icon-text_jztpvu.png", 
      copyright: '© 2025 ABC company Pvt. Ltd.. All rights reserved.'
    }
  });