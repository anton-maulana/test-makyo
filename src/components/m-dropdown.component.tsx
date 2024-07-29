import {MDropdownProps} from "./m-dropdown.props";
import {ReactNode, useEffect, useRef, useState} from "react";
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

    const onClickDropdown = () :void => {
        const rect =  buttonRef.current?.getBoundingClientRect() as DOMRectReadOnly;

        setPosition({
            top: `${rect?.bottom + window.scrollY}px`,
            left: `${rect?.left + window.scrollX}px`
        });
        setIsOpen(!isOpen);
    };


    const updateButtonWidth = () :void => {
        if (buttonRef.current) {
            setButtonWidth(buttonRef.current.offsetWidth);
        }
    };

    const onBlurDropdown = (event: MouseEvent) => {
        const node = event.target as HTMLElement;
        if(node.className.includes("m-dropdown")) {
            return
        } else if (node.getElementsByTagName("body").length > 0) {
            setIsOpen(false);
        } else if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    const highlightText = (text: string) :string => {
        if(searchInput.length > 0) {
            const regex = new RegExp(searchInput, 'gi');
            return text.replace(regex, match => `<mark style="background: #aeccfc">${match}</mark>`);
        }
        else
            return text
    }

    const renderListDropdown = () :ReactNode => {
        if (typeof data[0] == "string") {
            let items = data as string[];

            if (searchInput.length > 0)
                items = items.filter(e => e.toLowerCase().indexOf(searchInput.toLowerCase()) !== -1);

            return items.map( (item, indexRow) =>
                <div key={indexRow}>
                    <div dangerouslySetInnerHTML={{ __html: highlightText(item) }} />
                </div>
            )
        } else if (titleProperty) {
            let items = data as Record<string, any>[];

            if (searchInput.length > 0)
                items = items.filter(e => e[titleProperty].toLowerCase().indexOf(searchInput.toLowerCase()) !== -1);
            
            return items.map( (item, indexRow) =>
                <div key={indexRow}>
                    <div dangerouslySetInnerHTML={{ __html: highlightText(item[titleProperty]) }} />
                </div>
            )
        } else {
            return (<div>list is empty</div>)
        }
    }

    const onTyping = (e: React.FormEvent<HTMLInputElement>) :void => {
        setSearchInput(e.currentTarget.value)
    }

    useEffect(() => {
        updateButtonWidth();

        window.addEventListener('resize', updateButtonWidth);
        window.addEventListener('click', onBlurDropdown);

        return () => {
            window.removeEventListener('resize', updateButtonWidth);
            window.removeEventListener('click', onBlurDropdown);
        };
    }, []);

    useEffect(() => {
        if (!isOpen)  {
            setSearchInput("");
        }
    }, [isOpen]);    

    return (
        <React.Fragment>
            <button className={`bg-gray-300 w-full h-full relative ${isOpen? "caret-close": "caret-open"} m-dropdown`}
                    onClick={onClickDropdown}
                    ref={buttonRef}>
            </button>
            {isOpen &&
                <Portal>
                    <div id={"box-dropdown"} ref={dropdownRef} className={"h-64 bg-slate-300 absolute flex wrapper-box-dropdown"}
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