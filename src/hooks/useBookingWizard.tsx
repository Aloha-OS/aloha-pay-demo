import { useReducer, useMemo, createContext, useContext, type ReactNode } from "react";
import type { BookingState, BookingAction, GuestInfo, Room } from "@/types/hotel";
import { getRoomById } from "@/data/hotel/rooms";
import { calculateNights } from "@/lib/hotel/date-utils";

const initialState: BookingState = {
	step: 1,
	checkInDate: null,
	checkOutDate: null,
	selectedRoomId: null,
	guestInfo: null,
	paymentMethod: null,
	numberOfGuests: 2,
	numberOfNights: 0,
	totalPrice: 0,
};

function calculateTotalPrice(room: Room | undefined, nights: number): number {
	if (!room || nights === 0) return 0;
	return room.pricePerNight * nights;
}

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
	switch (action.type) {
		case "SET_DATES": {
			const nights = calculateNights(action.checkIn, action.checkOut);
			const room = state.selectedRoomId ? getRoomById(state.selectedRoomId) : undefined;
			return {
				...state,
				checkInDate: action.checkIn,
				checkOutDate: action.checkOut,
				numberOfNights: nights,
				totalPrice: calculateTotalPrice(room, nights),
			};
		}
		case "SELECT_ROOM": {
			const room = getRoomById(action.roomId);
			return {
				...state,
				selectedRoomId: action.roomId,
				totalPrice: calculateTotalPrice(room, state.numberOfNights),
			};
		}
		case "SET_GUEST_INFO":
			return { ...state, guestInfo: action.info };
		case "SET_PAYMENT_METHOD":
			return { ...state, paymentMethod: action.method };
		case "SET_GUESTS":
			return { ...state, numberOfGuests: action.count };
		case "NEXT_STEP":
			return { ...state, step: Math.min(state.step + 1, 4) as 1 | 2 | 3 | 4 };
		case "PREV_STEP":
			return { ...state, step: Math.max(state.step - 1, 1) as 1 | 2 | 3 | 4 };
		case "GO_TO_STEP":
			return { ...state, step: action.step };
		case "RESET":
			return initialState;
		default:
			return state;
	}
}

export function useBookingWizard(initialRoomId?: string) {
	const initialStateWithRoom: BookingState = initialRoomId
		? { ...initialState, selectedRoomId: initialRoomId }
		: initialState;

	const [state, dispatch] = useReducer(bookingReducer, initialStateWithRoom);

	const actions = useMemo(
		() => ({
			setDates: (checkIn: string, checkOut: string) =>
				dispatch({ type: "SET_DATES", checkIn, checkOut }),
			selectRoom: (roomId: string) => dispatch({ type: "SELECT_ROOM", roomId }),
			setGuestInfo: (info: GuestInfo) => dispatch({ type: "SET_GUEST_INFO", info }),
			setPaymentMethod: (method: "aloha-pay" | "credit-card") =>
				dispatch({ type: "SET_PAYMENT_METHOD", method }),
			setGuests: (count: number) => dispatch({ type: "SET_GUESTS", count }),
			nextStep: () => dispatch({ type: "NEXT_STEP" }),
			prevStep: () => dispatch({ type: "PREV_STEP" }),
			goToStep: (step: 1 | 2 | 3 | 4) => dispatch({ type: "GO_TO_STEP", step }),
			reset: () => dispatch({ type: "RESET" }),
		}),
		[],
	);

	const selectedRoom = state.selectedRoomId
		? getRoomById(state.selectedRoomId)
		: undefined;

	const canProceed = useMemo(
		() => ({
			step1: Boolean(state.checkInDate && state.checkOutDate),
			step2: Boolean(state.selectedRoomId),
			step3: Boolean(state.guestInfo),
			step4: Boolean(state.paymentMethod),
		}),
		[state],
	);

	return { state, actions, selectedRoom, canProceed };
}

// Context for sharing across wizard components
type BookingContextType = ReturnType<typeof useBookingWizard>;

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({
	children,
	initialRoomId,
}: {
	children: ReactNode;
	initialRoomId?: string;
}) {
	const booking = useBookingWizard(initialRoomId);
	return (
		<BookingContext.Provider value={booking}>{children}</BookingContext.Provider>
	);
}

export function useBooking() {
	const context = useContext(BookingContext);
	if (!context) {
		throw new Error("useBooking must be used within BookingProvider");
	}
	return context;
}
