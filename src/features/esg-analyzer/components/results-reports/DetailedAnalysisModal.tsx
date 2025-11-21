'use client';

import { useEffect, useState } from 'react';

import { createPortal } from 'react-dom';

import { DIMENSION_THEME_MAPPING } from '../../services/csvDataStructure';
import { DimensionGapData, ThemeGapData } from '../../types';

import { DimensionCard } from './detailed-analysis';

interface DetailedAnalysisModalProps {
    isOpen: boolean;
    onClose: () => void;
    dimensionData: DimensionGapData[];
    themeData: ThemeGapData[];
}

export function DetailedAnalysisModal({
    isOpen,
    onClose,
    dimensionData,
    themeData
}: DetailedAnalysisModalProps) {
    const [expandedDimensions, setExpandedDimensions] = useState<string[]>([]);
    const [expandedThemes, setExpandedThemes] = useState<string[]>([]);
    const [expandedIndicators, setExpandedIndicators] = useState<string[]>([]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const themesByDimension = {
        Environmental: themeData.filter(theme =>
            DIMENSION_THEME_MAPPING.Environmental.includes(theme.name)
        ),
        Social: themeData.filter(theme =>
            DIMENSION_THEME_MAPPING.Social.includes(theme.name)
        ),
        Governance: themeData.filter(theme =>
            DIMENSION_THEME_MAPPING.Governance.includes(theme.name)
        )
    };

    const handleClose = () => {
        setExpandedDimensions([]);
        setExpandedThemes([]);
        setExpandedIndicators([]);
        onClose();
    };

    const toggleDimension = (dimension: string) => {
        setExpandedDimensions(prev =>
            prev.includes(dimension)
                ? prev.filter(d => d !== dimension)
                : [...prev, dimension]
        );
    };

    const toggleTheme = (themeId: string) => {
        setExpandedThemes(prev =>
            prev.includes(themeId)
                ? prev.filter(t => t !== themeId)
                : [...prev, themeId]
        );
    };

    const toggleIndicator = (indicatorId: string) => {
        setExpandedIndicators(prev =>
            prev.includes(indicatorId)
                ? prev.filter(i => i !== indicatorId)
                : [...prev, indicatorId]
        );
    };

    const getDimensionData = (dimensionName: string) => {
        return dimensionData.find(d => d.name === dimensionName);
    };

    const handleBackgroundClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const modalContent = (
        <div
            className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 9999
            }}
            onClick={handleBackgroundClick}
        >
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-900">Detailed ESG Analysis</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        ×
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6">
                    {Object.entries(themesByDimension).map(([dimension, themes]) => (
                        <DimensionCard
                            key={dimension}
                            dimension={dimension}
                            themes={themes}
                            dimensionData={getDimensionData(dimension)}
                            isExpanded={expandedDimensions.includes(dimension)}
                            expandedThemes={expandedThemes}
                            expandedIndicators={expandedIndicators}
                            onToggleDimension={toggleDimension}
                            onToggleTheme={toggleTheme}
                            onToggleIndicator={toggleIndicator}
                        />
                    ))}
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end p-6 border-t">
                    <button
                        onClick={handleClose}
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
