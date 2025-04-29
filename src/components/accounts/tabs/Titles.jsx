import { SearchInput } from '@/components/forms/Search'
import OutlineButton from '@/components/OutlineButton'
import PrimaryButton from '@/components/PrimaryButton'
import api, { createUrlParams } from '@/utils/api'
import { Plus, X } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'

const Titles = () => {
    const [titles, setTitles] = useState([])
    const [isFetchingTitles, setIsFetchingTitles] = useState(false)

    const [searchQuery, setSearchQuery] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [showNewTitleForm, setShowNewTitleForm] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [showFilters, setShowFilters] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const isFocused = document.activeElement;

    const handleSearch = useCallback(() => {
        if (searchQuery.length >= 3) {
            setIsSearching(true);
            const params = createUrlParams({
                search: searchQuery,
                page: pageNumber,
                page_size: pageSize
            })
            fetchTitles(params);

        }
        else if (searchQuery.length === 0 && isFocused) {
            setIsSearching(true);
            fetchTitles();
        } else {
            setIsSearching(false);
        }
    }, [searchQuery]);

    const fetchTitles = async (params) => {
        setIsFetchingTitles(true)
        try {
            const response = await api.get(`/titles/?${params}`);
            if (response.status === 200) {
                const formattedTitles = response.data.map((title) => ({
                    value: title.id,
                    label: title.name,
                }))
                setTitles(formattedTitles)
            }
        } catch (error) {
            console.error('Error fetching titles:', error)
        } finally {
            setIsFetchingTitles(false)
        }
    }

    const handleApplyFilters = () => {
        const params = createUrlParams({
            page: pageNumber,
            page_size: pageSize
        });
        setIsSearching(true)
        fetchTitles(params);
        setShowFilters(false)
    }

    const handleShowFilters = () => {
        setShowFilters(!showFilters);
    }


    useEffect(() => {
        const debounceTimeout = setTimeout(() => {
            handleSearch();
        }, 300);

        return () => clearTimeout(debounceTimeout);
    }, [searchQuery, handleSearch])


    useEffect(() => {
        fetchTitles()
    }
        , [])
    return (
        <div className='titles'>
            <div className="filters">
                <SearchInput value={searchQuery} setValue={setSearchQuery} isSearching={isSearching} label={'Search users by email, names or phone number'} />

                <div className="actions">
                    <span>Page: {pageNumber}</span>
                    <span>Per page: {pageSize}</span>
                    <div className="filters-popup">
                        <OutlineButton
                            onClick={handleShowFilters}
                            span={'Filters'}
                            prefixIcon={showFilters ? <X /> : <Plus />}
                        />

                        {
                            showFilters ?
                                <div className="side-popup">
                                    <div className="popup-content">
                                        <h3>Filters</h3>
                                        <form>
                                            <div className="half">
                                                <div className="form-group">
                                                    <label htmlFor="page">Page</label>
                                                    <input value={pageNumber} onChange={e => setPageNumber(e.target.value)} type="number" name="pageNumber" id="pageNumber" placeholder='Page number' />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="page">Page size</label>
                                                    <input value={pageSize} onChange={e => setPageSize(e.target.value)} type="number" name="pageSize" id="pageSize" placeholder='Page size' />
                                                </div>
                                            </div>
                                        </form>

                                        <PrimaryButton text={'Apply filters'} onClick={handleApplyFilters} />
                                    </div>
                                </div>
                                : ''
                        }
                    </div>

                    <PrimaryButton
                        onClick={() => setShowNewUserForm(true)}
                        span="Add title"
                        prefixIcon={<Plus />}
                        customClass={'sticky-button'}
                    />
                </div>
            </div>
            {isFetchingTitles ? (
                <p>Loading titles...</p>
            ) : (

                titles.map((title) => (
                    <div key={title.value} className='title-item'>
                        <span>{title.label}</span>
                    </div>
                ))
            )}
        </div>
    )
}

export default Titles