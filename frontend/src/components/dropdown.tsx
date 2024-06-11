import styled from "@emotion/styled";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { Stack } from "src/components/stack.ts";
import { useKeydown } from "src/utils/hooks/keydown.hook.ts";
import { Text } from "src/components/text.ts";
import { useOnClickOutside } from "src/utils/hooks/on-click-outside.hook.ts";

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${(p) => p.theme.colors.text};
`;

//const dropdown (with custom options)

interface LabeledDropdownProps {
  label: string;
  onChange: (v: string) => void;
  value?: string;
  defaultValue?: string;
  isRequired?: boolean;
  options: string[];
  disabledOptions?: string[];
  id?: string;
}

const Drowdown = styled.select`
  border: 1px solid ${(p) => p.theme.colors.inputBorder};
  width: 100%;
  font-size: 14px;
  font-weight: 400;
  color: ${(p) => p.theme.colors.textSecondary};
  padding: 8px;
  border-radius: 4px;
  background-color: ${(p) => p.theme.colors.input.background};

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.link};
`;

export const LabeledDropdown = observer((x: LabeledDropdownProps) => {
  return (
    <Stack direction="column" gap={4}>
      <Label>
        {x.label}
        <Text color={"#B91827"}>{x.isRequired ? "*" : ""}</Text>
      </Label>
      <Drowdown
        value={x.value ?? "Не выбрано"}
        onChange={(e) => x.onChange(e.target.value)}
      >
        {x.options.map((o) => (
          <option
            key={o}
            value={o}
            selected={true}
            disabled={o === "Не выбрано"}
          >
            {o}
          </option>
        ))}
      </Drowdown>
    </Stack>
  );
});

export const CustomDropdown = observer<LabeledDropdownProps>((x) => {
  const [isOpen, setIsOpen] = useState(false);
  const [curOption, setCurOption] = useState(x.value);
  const ref = React.useRef<HTMLDivElement>(null);
  useKeydown("Enter", () => setIsOpen(false), undefined, [isOpen]);
  useOnClickOutside([ref], () => setIsOpen(false));
  const handleSelect = (option: string) => {
    setCurOption(option);
    x.onChange(option);
    setIsOpen(false);
  };

  return (
    <CustomDropdownWrapper
      direction="column"
      gap={4}
      ref={ref}
      key={x.label}
      onClick={() => setIsOpen(!isOpen)}
      spellCheck={false}
    >
      <Label>
        {x.label}
        <Text color={"#B91827"}>{x.isRequired ? "*" : ""}</Text>
      </Label>
      <DropdownButton type="button">
        {curOption ?? "Не выбрано"}
        <Text
          fontFamily={"IcoMoon"}
          size={10}
          style={{
            marginLeft: "auto",
            transform: isOpen ? "rotate(180deg)" : "none",
          }}
        >
          
        </Text>
      </DropdownButton>
      {isOpen && (
        <Stack
          direction="column"
          gap={4}
          style={{ display: "contents", height: "100px", overflow: "auto" }}
        >
          <OptionsList>
            {x.options.map((option, index) => (
              <Option
                key={option}
                onClick={() => handleSelect(option)}
                aria-selected={option === curOption}
                aria-disabled={x.disabledOptions?.includes(option)}
                tabIndex={index}
              >
                {option}
              </Option>
            ))}
          </OptionsList>
        </Stack>
      )}
    </CustomDropdownWrapper>
  );
});

interface DropdownWithSearchProps extends LabeledDropdownProps {
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (v: string) => void;
}

const Input = styled.input`
  border: 1px solid ${(p) => p.theme.colors.inputBorder};
  position: relative;
  font-size: 14px;
  font-weight: 400;
  background: ${(p) => p.theme.colors.input};
  color: ${(p) => p.theme.colors.textSecondary};
  padding: 6px 10px;
  border-radius: 4px;

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.link};
  }

  &:hover {
    border-color: transparent;
  }
`;

export const DropdownWithSearch = observer((x: DropdownWithSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = x.options.find((option) => option === x.value);
  const abilityOptions = x.options.filter((option) => option !== x.value);
  const ref = React.useRef<HTMLDivElement>(null);
  useKeydown("Escape", () => setIsOpen(false), undefined, [isOpen]);

  useKeydown(
    "Enter",
    () => {
      if (isOpen && x.options.length > 0) {
        x.onChange(x.options[0]);
      }
    },
    undefined,
    [isOpen],
  );

  useOnClickOutside([ref], () => setIsOpen(false));

  const handleSelect = (
    option: string,
    e: React.MouseEvent<HTMLDivElement>,
  ) => {
    e.stopPropagation();
    x.onChange(option);
    setIsOpen(false);
  };

  const handleDropdownClick = () => {
    setIsOpen(true);
  };

  const onInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    x.onSearchChange(e.target.value);
    setIsOpen(true);
  };

  return (
    <CustomDropdownWrapper
      direction="column"
      gap={4}
      ref={ref}
      key={x.label}
      onClick={handleDropdownClick}
      spellCheck={false}
    >
      <Label>
        {x.label}
        <Text color={"#B91827"}>{x.isRequired ? "*" : ""}</Text>
      </Label>
      <Input
        placeholder={x.searchPlaceholder}
        value={x.searchValue}
        onChange={onInputChanged}
      />
      {isOpen && Boolean(x.options.length) && (
        <Stack
          direction="column"
          gap={4}
          style={{ display: "contents", height: "100px", overflow: "auto" }}
        >
          <OptionsList>
            <div
              className={"scrollable"}
              style={{ maxHeight: "200px", overflow: "auto" }}
            >
              {abilityOptions.map((option) => (
                <Option
                  key={option}
                  onClick={(e) => handleSelect(option, e)}
                  aria-selected={option === selectedOption}
                  aria-disabled={x.disabledOptions?.includes(option)}
                >
                  {option}
                </Option>
              ))}
            </div>
          </OptionsList>
        </Stack>
      )}
    </CustomDropdownWrapper>
  );
});

const CustomDropdownWrapper = styled(Stack)`
  position: relative;
  width: 100%;
`;

const DropdownButton = styled.button`
  border: 1px solid ${(p) => p.theme.colors.inputBorder};
  width: 100%;
  display: flex;
  align-items: center;
  font-family: "MoscowSans", sans-serif;
  justify-content: start;
  font-size: 14px;
  font-weight: 400;
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.textSecondary};
  padding: 14px 18px;
  border-radius: 4px;

  &:focus {
    border-color: ${(p) => p.theme.colors.link};
  }

  &:hover {
    border-color: ${(p) => p.theme.colors.link};
  }
`;

const OptionsList = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
  top: 68px;
  max-height: 200px;
  overflow: auto;
  z-index: 1000;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border: 1px solid ${(p) => p.theme.colors.inputBorder};
`;

const Option = styled.div<{
  ["aria-selected"]?: boolean;
  ["aria-disabled"]?: boolean;
}>`
  background: ${(p) => (p["aria-selected"] ? "#f0f0f0" : "#fff")};
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${(p) => p.theme.colors.inputBorder};
  padding: 10px 14px;

  &[aria-selected="true"] {
    background: #f0f0f0;
    font-weight: 700;
  }

  &[aria-disabled="true"] {
    background: #fafafa;
    color: #9b9b9b;
    cursor: not-allowed;
    user-select: none;
  }

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f0f0f0;
  }
`;
