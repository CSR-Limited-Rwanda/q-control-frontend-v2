"use client";
import '@/styles/_components.scss'
import React, { useState, useRef, useEffect } from "react";

const Dropdown = ({ trigger, label, children }) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="dropdown" ref={dropdownRef}>
			<button
				className="dropdown__trigger"
				onClick={() => setIsOpen(!isOpen)}>
				{trigger}
			</button>

			<div className={`dropdown__content ${isOpen ? "open" : ""}`}>
				{label && (
					<div className="dropdown__label">{label}</div>
				)}
				{children}
			</div>
		</div>
	);
};

export const DropdownItem = ({ children, onClick }) => (
	<button className="dropdown__item" onClick={onClick}>
		{children}
	</button>
);

export default Dropdown;
