import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import styled from 'styled-components';
import { colors } from '../styles';
import { RootState } from '../redux';

import HandRange, {
  COMBO_NAMES,
  RANK_TO_CHAR,
  SUIT_TO_CHAR,
  suitColor,
  ranks,
  suits,
} from '../redux/range/HandRange';

import {
  setRangeAll,
  setComboActive,
  setComboInactive,
  setSuitComboActive,
  setSuitComboInactive,
  setRangeBroadway,
  setRangePairs,
  setRange,
  clearRange,
} from '../redux/range/actions';

import Matrix from '../components/Matrix';
import TextArea from '../components/TextArea';

const RangeSelectorStyle = styled.div`
  display: flex;
  flex-direction: column;

  .range-selector-top-bar {
    display: flex;
    margin-bottom: 24px;
    .range-selector-top-bar-item {
      &:first-child {
        flex-grow: 1;
      }
      &:not(:first-child) {
        margin-left: 8px;
      }
    }
  }

  .range-selector-matrix {
    flex-grow: 1;
  }

  .range-selector-text-area {
    height: 120px;
  }

  .combo-count {
    font-size: inherit;
    /* line-height: 14px; */
    margin-bottom: 0.6em;
    vertical-align: center;
    color: rgba(0, 0, 0, 0.45);
    font-family: 'Open Sans', 'sans-serif';
    .combo-count-selected {
      color: ${colors.primary};
    }
  }

  .range-selector-bottom-bar {
    margin-top: 0.8em;
    display: grid;
    grid-template-columns: 1fr minmax(auto, 250px);
    grid-gap: 0.8em;
    width: 100%;
    position: relative;
  }

  .range-selector-suit-matrix {
  }

  .range-selector-controls {
    /* margin-top: 8px; */
    flex-grow: 1;
    .range-selector-controls-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      box-shadow: inset 0 -3px 0 rgba(0, 0, 0, 0.05);
      .range-selector-clear-btn {
        color: ${colors.warning} !important;
        &:after {
          background: ${colors.warning} !important;
        }
      }
      .range-selector-control-btn {
        color: rgba(0, 0, 0, 0.65);
        cursor: pointer;
        position: relative;
        padding: 0.8em 0;
        text-align: center;
        &:after {
          content: '';
          position: absolute;
          height: 3px;
          width: 0;
          background: ${colors.primary};
          transition: width 0.2s, left 0.2s;
          bottom: 0;
          left: 50%;
        }
        &:hover {
          &:after {
            width: 100%;
            left: 0;
          }
        }
      }
    }
  }
`;

const mapStateToProps = (state: RootState) => {
  return {
    handRange: state.range.handRange,
    activeCombo: state.range.activeCombo
  };
};

const mapDispatchToProps = {
  setComboActive,
  setComboInactive,
  clearRange,
  setSuitComboActive,
  setSuitComboInactive,
  setRangeBroadway,
  setRangePairs,
  setRangeAll,
  setRange,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  handRange: HandRange;
  activeCombo: number;
  className?: string;
  setComboActive: (index: number) => void;
  setComboInactive: (index: number) => void;
  setSuitComboActive: (index: number) => void;
  setSuitComboInactive: (index: number) => void;
  setRange: (handRange: HandRange) => void;
  clearRange: () => void;
  setRangeAll: () => void;
  setRangeBroadway: () => void;
  setRangePairs: () => void;
};

type SuitComboProps = {
  comboIndex: number;
  suitIndex: number;
};

function SuitCombo(props: SuitComboProps): React.ReactElement {
  const { comboIndex, suitIndex } = props;
  const [firstRank, secondRank] = ranks(comboIndex);
  const [firstSuit, secondSuit] = suits(suitIndex);
  return (
    <div>
      {RANK_TO_CHAR[firstRank > secondRank ? firstRank : secondRank]}
      <span style={{ color: suitColor(firstRank > secondRank ? firstSuit : secondSuit), fontFamily: 'Hiragino Sans' }}>
        {SUIT_TO_CHAR[firstRank > secondRank ? firstSuit : secondSuit]}
      </span>
      {RANK_TO_CHAR[firstRank > secondRank ? secondRank: firstRank]}
      <span style={{ color: suitColor(firstRank > secondRank ? secondSuit : firstSuit), fontFamily: 'Hiragino Sans'}}>
        {SUIT_TO_CHAR[firstRank > secondRank ? secondSuit : firstSuit]}
      </span>
    </div>
  )
}

function RangeSelector(props: Props): React.ReactElement {
  const {
    handRange,
    setComboActive,
    setComboInactive,
    setSuitComboActive,
    setSuitComboInactive,
    setRange,
    setRangePairs,
    setRangeBroadway,
    setRangeAll,
    clearRange,
    activeCombo,
    className = '',
  } = props;

  function setRangeText(rangeStr: string) {
    setRange(HandRange.fromString(rangeStr));
  }

  const comboCount = handRange.comboCount();
  const comboStates = handRange.comboStates();
  const rangeStr = handRange.toString();

  const suitCombos = new Array(16).fill(0).map((_, i) => <SuitCombo key={`${activeCombo}-${i}`} comboIndex={activeCombo} suitIndex={i}/>);
  const suitStates = handRange.comboState(activeCombo);

  return (
    <RangeSelectorStyle className={className}>
      <Matrix
        elements={COMBO_NAMES}
        states={comboStates}
        onSelectElement={setComboActive}
        onDeselectElement={setComboInactive}
        rows={13}
        cols={13}
        className="range-selector-matrix"
      />
      <div className="range-selector-bottom-bar">
        <div className="range-selector-controls">
          <div className="combo-count">
            <span className="combo-count-selected">{comboCount}</span>/1326 combos selected{' '}
            <span className="combo-count-selected">({((comboCount * 100) / 1326).toPrecision(3)}%)</span>
          </div>
          <div className="range-selector-controls-buttons">
            <div className="range-selector-control-btn" onClick={setRangeAll}>
              All
            </div>
            <div className="range-selector-control-btn" onClick={setRangePairs}>
              Pairs
            </div>
            <div className="range-selector-control-btn" onClick={setRangeBroadway}>
              Broadway
            </div>
            <div className="range-selector-control-btn range-selector-clear-btn" onClick={clearRange}>
              Clear
            </div>
          </div>
          <TextArea
            rows={4}
            cols={4}
            className="range-selector-text-area"
            placeholder="Enter range e.g. (QQ+,AK)"
            onChange={setRangeText}
            value={rangeStr}
          />
        </div>
        <Matrix
          className="range-selector-suit-matrix"
          onSelectElement={setSuitComboActive}
          onDeselectElement={setSuitComboInactive}
          elements={suitCombos}
          states={suitStates}
          rows={4}
          cols={4}
        />
      </div>
    </RangeSelectorStyle>
  );
}

export default connector(RangeSelector);
