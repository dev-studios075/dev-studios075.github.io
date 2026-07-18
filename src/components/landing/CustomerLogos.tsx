type Customer = {
  name: string;
  logo: string;
  width: number;
  height: number;
  monochrome: boolean;
};

const customers: Customer[] = [
  {
    name: "ABR Logistics",
    logo: "/assets/clients/abr-logistics.png",
    width: 612,
    height: 153,
    monochrome: false,
  },
  {
    name: "Safexpress",
    logo: "/assets/clients/safexpress.png",
    width: 1200,
    height: 485,
    monochrome: false,
  },
  {
    name: "Tegra Express",
    logo: "/assets/clients/tegra-express.png",
    width: 208,
    height: 72,
    monochrome: true,
  },
  {
    name: "Chhikara Logistics",
    logo: "/assets/clients/chhikara-logistics.png",
    width: 623,
    height: 212,
    monochrome: false,
  },
];

const CustomerLogos = () => (
  <div className="mt-12 border-t border-border/60 pt-8 sm:pt-9 lg:mt-16">
    <p
      id="customer-logos-title"
      className="mb-7 text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground/70"
    >
      Trusted by forward-thinking logistics teams
    </p>

    <ul
      aria-labelledby="customer-logos-title"
      className="mx-auto grid max-w-5xl grid-cols-2 items-center gap-y-7 sm:gap-y-8 lg:grid-cols-4 lg:gap-y-0"
    >
      {customers.map((customer, index) => (
        <li
          key={customer.name}
          className={`group flex min-h-14 items-center justify-center px-4 sm:px-6 ${
            index % 2 === 1 ? "border-l border-border/50" : ""
          } ${index > 0 ? "lg:border-l lg:border-border/50" : "lg:border-l-0"}`}
        >
          <img
            src={customer.logo}
            alt={`${customer.name} logo`}
            width={customer.width}
            height={customer.height}
            loading="lazy"
            decoding="async"
            className={`h-9 w-auto max-w-[145px] object-contain opacity-70 transition-all duration-300 group-hover:opacity-100 sm:h-10 sm:max-w-[175px] ${
              customer.monochrome
                ? "grayscale mix-blend-multiply dark:invert dark:mix-blend-screen"
                : "dark:brightness-110"
            }`}
          />
        </li>
      ))}
    </ul>
  </div>
);

export default CustomerLogos;
