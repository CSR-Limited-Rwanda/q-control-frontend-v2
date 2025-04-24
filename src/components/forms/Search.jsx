import { LoaderCircle, Search, X } from "lucide-react";

export const SearchInput = ({ value, setValue, isSearching, label }) => {
    return (
        <div className="search-input">
            <input
                type="text"
                name="searchRole"
                id="searchRole"
                placeholder={label || "Search..."}
                onChange={(e) => setValue(e.target.value)}
                value={value}
            />
            <div className="icon">
                {isSearching ? (
                    <LoaderCircle className="loading-icon" />
                ) : value ? (
                    <X onClick={() => setValue("")} />
                ) : (
                    <Search />
                )}
            </div>
        </div>
    );
};