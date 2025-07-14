'use client'
import { MoveLeft } from 'lucide-react';
import Link from 'next/link'

const BackToPage = ({ link, pageName }) => {
    return (
        <Link href={link} className="back-link">
            <div className="icon">
                <MoveLeft />
            </div>
            <p>Back to {pageName}</p>
        </Link>
    )
}

export default BackToPage