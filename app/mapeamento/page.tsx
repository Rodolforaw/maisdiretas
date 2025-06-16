import dynamic from "next/dynamic";

const MapDrawing = dynamic(() => import("@/components/MapDrawing"), { ssr: false });

export default function MapeamentoPage() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Mapeamento de Obra</h1>
      <p className="text-sm text-muted-foreground">
        Selecione uma obra e desenhe a área diretamente no mapa com ferramentas interativas.
      </p>
      <MapDrawing />
    </div>
  );
}
