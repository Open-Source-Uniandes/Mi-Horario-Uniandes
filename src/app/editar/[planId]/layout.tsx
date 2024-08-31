export default function LayoutEditar({children}: {children: React.ReactNode}) {
    return children;
  }
  
  export async function generateStaticParams() {
    const planIds = [1, 2, 3, 4, 5];
    return planIds.map(planId => ({
      planId: planId.toString(),
    }));
  }