import {MDropdownProps} from "./m-dropdown.props";
import {useContext, useEffect, useRef, useState} from "react";
import {AppContext, ServicesContextType} from "../index";
import React from "react";
import {SearchIcon} from "../assets/svgs-icon";
import Portal from "./portal.component";

const MDropdownComponent: React.FC<MDropdownProps> = ({data, titleProperty}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [buttonWidth, setButtonWidth] = useState(0);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [position, setPosition] = useState({ top: '0px', left: '0px' });
    const [searchInput, setSearchInput] = useState("");

    const handleClick = (event: any) => {
        const rect =  buttonRef.current?.getBoundingClientRect() as DOMRectReadOnly;

        setPosition({
            top: `${rect?.bottom + window.scrollY}px`, // Position below the button
            left: `${rect?.left + window.scrollX}px`  // Align with button left
        });
        setIsOpen(!isOpen);
    };


    const updateButtonWidth = () => {
        if (buttonRef.current) {
            setButtonWidth(buttonRef.current.offsetWidth);
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        const node = event.target as HTMLElement;
        if(node.className.includes("m-dropdown")) {
            return
        } else if (node.getElementsByTagName("body").length > 0) {
            setIsOpen(false);
        } else if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        updateButtonWidth();

        window.addEventListener('resize', updateButtonWidth);
        window.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('resize', updateButtonWidth);
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const renderListDropdown = () => {
        if (typeof data[0] == "string") {
            const items = data as string[];
            return items.map( (item, indexRow) =>
                <div key={indexRow}>
                    {item}
                </div>
            )
        } else if (titleProperty) {
            const items = data as Record<string, any>[];
            return items.map( (item, indexRow) =>
                <div key={indexRow}>
                    {item[titleProperty]}
                </div>
            )
        } else {
            return (<div>list is empty</div>)
        }
    }


    const onTyping = (e:any) => {
        return(null)
    }


    return (
        <React.Fragment>
            <button className={`bg-gray-300 w-full h-full relative ${isOpen? "caret-close": "caret-open"} m-dropdown`}
                    onClick={handleClick}
                    ref={buttonRef}>
            </button>
            {isOpen &&
                <Portal>
                    <div id={"box-dropdown"} ref={dropdownRef} className={"h-64 bg-amber-800 absolute flex wrapper-box-dropdown"}
                         style={{ width: buttonWidth, top: position.top, left: position.left }}>
                        <div className={"h-full w-full"}>
                            <div className="flex flex-col w-full h-[inherit]">
                                <div className={"flex flex-row w-full items-center"}>
                                    <SearchIcon height={"16px"} width={"16px"}  className={"absolute"}/>
                                    <input className={"w-full pl-6"} onChange={onTyping}/>
                                </div>
                                <div className={"w-full overflow-auto"}>
                                    {renderListDropdown()}
                                </div>
                            </div>
                        </div>
                    </div>
                </Portal>
            }
        </React.Fragment>
    )
}

export default MDropdownComponent;