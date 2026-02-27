export default function Copyright() {
  const currentYear = new Date().getFullYear();

  return (
    <p className="text-xl text-white font-semibold">
      © {currentYear} Self-Pay. All rights reserved.
    </p>
  );
}


