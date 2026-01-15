import { useState } from "react";
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { RoomImage } from "@/types/hotel";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface RoomGalleryProps {
	images: RoomImage[];
	roomName: string;
	className?: string;
}

export function RoomGallery({ images, roomName, className }: RoomGalleryProps) {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const selectedImage = images[selectedIndex];

	const goToPrevious = () => {
		setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
	};

	const goToNext = () => {
		setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "ArrowLeft") {
			goToPrevious();
		} else if (e.key === "ArrowRight") {
			goToNext();
		}
	};

	return (
		<div className={cn("space-y-4", className)}>
			{/* Main Image */}
			<div
				className="relative aspect-[16/10] rounded-xl overflow-hidden bg-zinc-100 group"
				onKeyDown={handleKeyDown}
				tabIndex={0}
				role="region"
				aria-label="Room gallery"
			>
				<img
					src={selectedImage?.url}
					alt={selectedImage?.alt}
					className="w-full h-full object-cover"
				/>

				{/* Navigation Arrows */}
				{images.length > 1 && (
					<>
						<button
							type="button"
							onClick={goToPrevious}
							className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
							aria-label="Previous image"
						>
							<ChevronLeft className="h-6 w-6 text-zinc-700" />
						</button>
						<button
							type="button"
							onClick={goToNext}
							className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
							aria-label="Next image"
						>
							<ChevronRight className="h-6 w-6 text-zinc-700" />
						</button>
					</>
				)}

				{/* Expand Button */}
				<button
					type="button"
					onClick={() => setIsModalOpen(true)}
					className="absolute bottom-4 right-4 px-3 py-2 rounded-lg bg-white/90 hover:bg-white flex items-center gap-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
					aria-label="View full screen"
				>
					<Expand className="h-4 w-4 text-zinc-700" />
					<span className="text-sm font-medium text-zinc-700">View Full</span>
				</button>

				{/* Image Counter */}
				<div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-black/50 text-white text-sm">
					{selectedIndex + 1} / {images.length}
				</div>
			</div>

			{/* Thumbnails */}
			{images.length > 1 && (
				<div className="flex gap-2 overflow-x-auto pb-2">
					{images.map((image, index) => (
						<button
							key={image.id}
							type="button"
							onClick={() => setSelectedIndex(index)}
							className={cn(
								"flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden transition-all",
								index === selectedIndex
									? "ring-2 ring-resort-ocean ring-offset-2"
									: "opacity-60 hover:opacity-100",
							)}
							aria-label={`View image ${index + 1}`}
						>
							<img
								src={image.url}
								alt={image.alt}
								className="w-full h-full object-cover"
							/>
						</button>
					))}
				</div>
			)}

			{/* Full Screen Modal */}
			<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
				<DialogContent className="max-w-6xl w-full p-0 bg-black border-none">
					<VisuallyHidden>
						<DialogTitle>{roomName} Gallery</DialogTitle>
					</VisuallyHidden>
					<div className="relative">
						{/* Close Button */}
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setIsModalOpen(false)}
							className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
						>
							<X className="h-6 w-6" />
						</Button>

						{/* Image */}
						<div className="aspect-[16/10] max-h-[80vh]">
							<img
								src={selectedImage?.url}
								alt={selectedImage?.alt}
								className="w-full h-full object-contain"
							/>
						</div>

						{/* Navigation */}
						{images.length > 1 && (
							<>
								<button
									type="button"
									onClick={goToPrevious}
									className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
									aria-label="Previous image"
								>
									<ChevronLeft className="h-8 w-8 text-white" />
								</button>
								<button
									type="button"
									onClick={goToNext}
									className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
									aria-label="Next image"
								>
									<ChevronRight className="h-8 w-8 text-white" />
								</button>
							</>
						)}

						{/* Counter */}
						<div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 text-white text-sm">
							{selectedIndex + 1} / {images.length}
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
