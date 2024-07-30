import {MDropdownProps} from "./m-dropdown.props";
import {ReactNode, useEffect, useRef, useState} from "react";
import React from "react";
import {SearchIcon} from "../assets/svgs-icon";
import Portal from "./portal.component";
import "./m-dropdown.style.css"
import { v4 as uuidv4 } from 'uuid';

const MDropdownComponent: React.FC<MDropdownProps> = ({
        data,
        titleProperty,
        onSelected,
        outlined = false,
        multiple = false,
        search = true
    }) => {
    const [listOptions, setListOptions] = useState<Record<string, any>[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [buttonWidth, setButtonWidth] = useState(0);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [position, setPosition] = useState({ top: '0px', left: '0px' });
    const [searchInput, setSearchInput] = useState("");
    const [selected, setSelected] = useState<Record<string, any>[]>([]);

    function recalculatePosition() {
        const rect =  buttonRef.current?.getBoundingClientRect() as DOMRectReadOnly;

        setPosition({
            top: `${(rect?.bottom + 5) + window.scrollY}px`,
            left: `${rect?.left + window.scrollX}px`
        });
    }

    const onClickDropdown = () :void => {
        recalculatePosition();
        setIsOpen(!isOpen);
    };

    const updateButtonWidth = () :void => {
        if (buttonRef.current)
            setButtonWidth(buttonRef.current.offsetWidth);

        recalculatePosition();
    };

    const onBlurDropdown = (event: MouseEvent) => {
        const node = event.target as HTMLElement;
        const inGroups = ["selected-item","selected-dropdown","m-dropdown"];
        if(inGroups.some(e => node.className.includes(e))) {
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

    const onCLickItemDropdown = (item: Record<string, any>) => {
        let listSelected = selected;
        if (multiple) {
            const indexItem = listSelected.findIndex(e => e.uuid === item.uuid);
            indexItem !== -1 ? listSelected.splice(indexItem, 1) : listSelected.push(item);
        } else {
            listSelected = [item]
        }
        setSelected([...listSelected]);
    }


    const isInList = (uuid: string) : string | boolean => {
        return selected.findIndex(e => e.uuid === uuid) !== -1 && 'active'
    }

    const renderListDropdown = () :ReactNode => {
        if (typeof data[0] == "string") {
            let items = listOptions;

            if (searchInput.length > 0)
                items = items.filter(e => e.toLowerCase().indexOf(searchInput.toLowerCase()) !== -1);

            return items.map( item =>
                <button key={item.uuid} className={"flex flex-row item-options"} onClick={() => onCLickItemDropdown(item)}>
                    <div dangerouslySetInnerHTML={{ __html: highlightText(item.name) }} />
                </button>
            )
        } else if (titleProperty) {
            let items = listOptions;

            if (searchInput.length > 0)
                items = items.filter(e => e[titleProperty].toLowerCase().indexOf(searchInput.toLowerCase()) !== -1);

            return items.map( item =>
                <button key={item.uuid}
                        className={`flex flex-row item-options ${isInList(item.uuid)}`}
                        onClick={() => onCLickItemDropdown(item)}>
                    <div dangerouslySetInnerHTML={{ __html: highlightText(item[titleProperty]) }} />
                </button>
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

    useEffect(() => {
        let list: Record<string, any>[] = [];
        if (typeof data[0] === "string") {
            const it = data as string[];
            list = it.map(i => ({uuid: uuidv4(), name: i}))
        } else if (titleProperty) {
            const it = data as Record<string, any>[];
            list = it.map(i => ({uuid: uuidv4(), ...i}))
        }

       setListOptions(list);
    }, [data, titleProperty]);

    return (
        <React.Fragment>
            <button className={`bg-gray-300 w-full h-full relative ${isOpen? "caret-close": "caret-open"} m-dropdown`}
                    onClick={onClickDropdown}
                    ref={buttonRef}>
                <div className={"flex flex-row justify-items-start gap-2 selected-dropdown"}>
                    {titleProperty && selected.map(e =>
                        <small onClick={() => onCLickItemDropdown(e) } className={"selected-item"} key={e.uuid}>{e[titleProperty]}</small>
                    )}
                    {!titleProperty && selected.map(e =>
                        <div className={"selected-item"} key={e.uuid}>{e.name}</div>
                    )}
                </div>
            </button>
            {isOpen &&
                <Portal>
                    <div id={"box-dropdown"} ref={dropdownRef} className={"h-64 bg-gray-300 absolute flex wrapper-box-dropdown shadow-md"}
                         style={{ width: buttonWidth, top: position.top, left: position.left }}>
                        <div className={"h-full w-full "}>
                            <div className="flex flex-col w-full h-[inherit] p-2.5">
                                {search && <div className={"flex flex-row w-full items-center"}>
                                    <SearchIcon height={"16px"} width={"16px"} className={"absolute"}/>
                                    <input className={"w-full pl-6"} onChange={onTyping}/>
                                </div>}
                                <div className={"w-full overflow-y-auto flex flex-col gap-0.5"}>
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