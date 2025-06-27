"use client";
import React from "react";
import { useCombinationContext } from "./combinationHighlighter";

/**
 * Component to display combination statistics
 */
export function CombinationStats({ className = "" }: { className?: string }) {
  const { statistics } = useCombinationContext();

  return (
    <div className={`combination-stats ${className}`}>
      <h6 className="combination-stats__title">🎯 Combination Statistics</h6>
      <div className="combination-stats__grid">
        <div className="combination-stats__item">
          <div className="combination-stats__value">
            {statistics.totalCombinations}
          </div>
          <div className="combination-stats__label">Total Combinations</div>
        </div>
        <div className="combination-stats__item">
          <div className="combination-stats__value">
            {statistics.selectedFacesWithCombinations}
          </div>
          <div className="combination-stats__label">Selected Faces</div>
        </div>
        <div className="combination-stats__item">
          <div className="combination-stats__value">
            {statistics.selectedModelsWithCombinations}
          </div>
          <div className="combination-stats__label">Selected Models</div>
        </div>
        <div className="combination-stats__item">
          <div className="combination-stats__value">
            {statistics.facesWithCombinations}
          </div>
          <div className="combination-stats__label">Unique Faces</div>
        </div>
      </div>
    </div>
  );
}

/**
 * Component to display combination legend
 */
export function CombinationLegend({
  className = "",
  maxItems = 10,
}: {
  className?: string;
  maxItems?: number;
}) {
  const { combinations } = useCombinationContext();

  const displayCombinations = combinations.slice(0, maxItems);

  if (combinations.length === 0) {
    return null;
  }

  return (
    <div className={`combination-legend ${className}`}>
      <h6 className="combination-legend__title">
        ✨ Existing Combinations ({combinations.length})
      </h6>
      <div className="combination-legend__items">
        {displayCombinations.map((combination) => (
          <div
            key={combination.id}
            className="combination-legend__item"
            title={`Created: ${combination.createdFmt}`}
          >
            <div
              className="combination-legend__color-dot"
              style={{ backgroundColor: combination.glowConfig.color }}
            />
            <span className="combination-legend__text">
              {combination.face.name} + {combination.model.name}
            </span>
          </div>
        ))}
        {combinations.length > maxItems && (
          <div className="combination-legend__item">
            <div
              className="combination-legend__color-dot"
              style={{ backgroundColor: "#9ca3af" }}
            />
            <span className="combination-legend__text">
              ... and {combinations.length - maxItems} more
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Debug panel component for development
 */
export function CombinationDebugPanel({
  className = "",
}: {
  className?: string;
}) {
  const { statistics, faceIdentifications, modelIdentifications, debug } =
    useCombinationContext();

  if (!debug) {
    return null;
  }

  return (
    <div className={`combination-debug ${className}`}>
      <div className="combination-debug__title">🐛 Debug Panel</div>
      <div className="combination-debug__item">
        <span className="combination-debug__label">Total Combinations:</span>
        <span className="combination-debug__value">
          {statistics.totalCombinations}
        </span>
      </div>
      <div className="combination-debug__item">
        <span className="combination-debug__label">Face Identifications:</span>
        <span className="combination-debug__value">
          {faceIdentifications.length}
        </span>
      </div>
      <div className="combination-debug__item">
        <span className="combination-debug__label">Model Identifications:</span>
        <span className="combination-debug__value">
          {modelIdentifications.length}
        </span>
      </div>
      <div className="combination-debug__item">
        <span className="combination-debug__label">Faces w/ Combinations:</span>
        <span className="combination-debug__value">
          {statistics.facesWithCombinations}
        </span>
      </div>
      <div className="combination-debug__item">
        <span className="combination-debug__label">
          Models w/ Combinations:
        </span>
        <span className="combination-debug__value">
          {statistics.modelsWithCombinations}
        </span>
      </div>
    </div>
  );
}
