import { RoomCanvas } from "@/components/RoomCanvas";

export default async function CanvasPage({ params }: { params: { roomId: string } }) {
    const roomId = (await params).roomId;

    return (
        <div className="bg-background min-h-screen">
            <RoomCanvas roomId={roomId} />
        </div>
    );
}
