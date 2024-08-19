"use client";
import askQuestion from "./lib/fetch";
import sanitizeInput from "./utils/sanitizeInput";
import { useState, useEffect, useRef } from "react";

const App = () => {
	// The inputVal is storing our users input which we can then send to the API.
	const [inputVal, setInputVal] = useState("Hey, what's your name?");
	// This is storing our memory, allowing us a list of the questions and responses.
	const [memory, setMemory] = useState<{ text: string; response: string }[]>(
		[],
	);
	// If this is set to true, our Button will display "Thinking..." instead of "Submit".
	const [loading, setLoading] = useState(false);
	// This is referencing the memoryRef so we can scroll to the bottom of the memory.
	const memoryRef = useRef(null);

	async function dataset() {
		// When the dataset function is called, setLoading is set to true, the API is called, and then setLoading is set to false.
		setLoading(true);
		const response = await askQuestion(inputVal);
		console.log(response);
		setLoading(false);
		// If the response is undefined, we set the response to "Apologies, I can't respond right now. Please try again later."
		const newMemory =
			response.choices[0].message.content === undefined
				? {
						text: inputVal,
						response:
							"Apologies, I can't respond right now. Please try again later.",
					}
				: // Otherwise, we set the response to the response from the API.
					{ text: inputVal, response: response.choices[0].message.content };
		// We then add the newMemory to the memory array.
		setMemory((prevMemory) => [...prevMemory, newMemory]);
	}

	// This function is used to handle the change in the input value.
	function handleChange(e: { target: { value: string } }) {
		const sanitizedInput = sanitizeInput(e.target.value);
		setInputVal(sanitizedInput);
	}

	// This useEffect is used to scroll to the bottom of the memoryRef when the memory changes.
	// biome-ignore lint/correctness/useExhaustiveDependencies: Needs to run on memory change
	useEffect(() => {
		if (memoryRef.current) {
			(memoryRef.current as HTMLDivElement).scrollTop = (
				memoryRef.current as HTMLDivElement
			).scrollHeight;
		}
	}, [memory]);

	// This is the welcome message that is displayed when the user first loads the page.
	const welcomeMessage =
		"Welcome to Powering Futures' career chat bot! Looking for guidance on your career path? Our AI chatbot is here to help! Ask questions about job options, resume tips, and interview prep. Start exploring your interests and uncover exciting opportunities today!";

	return (
		<main className="w-screen h-screen bg-slate-800 overflow-x-hidden grid grid-rows-auto-1fr text-slate-50 gap-2">
			<nav className="hidden md:inline w-full h-fit p-2 md:pl-10 bg-slate-900">
				<img
					className="md:h-[48px] lg:h-[64px]"
					src="/PowerFuture.png"
					alt="logo"
				/>
			</nav>
			<section className="w-full p-4 flex flex-col gap-2 items-center">
				<p className="font-bold text-size-sm w-full md:w-1/2 text-center">
					{welcomeMessage}
				</p>
				<br />
				{/* This is the memoryRef that stores the questions and responses. */}
				<div
					ref={memoryRef}
					className="w-full md:w-1/2 rounded-md h-[35em] whitespace-pre-line overflow-y-auto p-5"
				>
					{/* This maps over the memory array and displays the questions and responses. */}
					{memory.map((memory, index) => {
						const key = Math.random() * index + 1;
						return (
							<span className="h-3/4" key={key}>
								<span className="flex flex-col gap-2">
									<span className="font-bold px-4 py-2 bg-blue-900 text-slate-50 rounded-full w-fit self-end">
										{memory.text}
									</span>{" "}
									<span className="px-4 py-2 text-slate-50 rounded-full">
										{memory.response}
									</span>
								</span>
								<br />
							</span>
						);
					})}
				</div>
				<br />
				<section className="flex flex-row gap-5 justify-center w-3/4">
					<input
						type="text"
						value={inputVal}
						// When the inputVal changes, we set the inputVal to the value of the input.
						onChange={handleChange}
						// When the input is clicked, we select the text.
						onFocus={(e) => e.target.select()}
						className="border-blue-200 px-4 py-2 border-2 rounded-md w-1/2 bg-slate-900"
					/>
					<button
						className="text-slate-50 bg-blue-900 hover:bg-blue-400 transition-all duration-1000 px-4 py-2 rounded-md"
						type="button"
						// When the button is clicked, we call the dataset function.
						onClick={() => dataset()}
					>
						{/* If loading is true, we display "Thinking...", otherwise we display "Submit". */}
						{loading ? "Thinking..." : "Submit"}
					</button>
				</section>
			</section>
		</main>
	);
};

export default App;
