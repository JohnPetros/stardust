import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";

import type { ChallengeSchema } from "@stardust/validation/challenging/types";
import { DataType } from "@stardust/core/challenging/structs";

import { CodeInput } from "../../../../CodeInput";
import { DataTypeNameSelect } from "../../../DataTypeNameSelect";
import { DataTypeInput } from "../../../DataTypeInput";
import { DEFAULT_VALUE_BY_DATA_TYPE_NAME } from "@stardust/core/challenging/constants";
import { useEffect, useState } from "react";

type TestCaseInputsProps = {
  defaultValue: unknown;
  testCaseIndex: number;
  paramIndex: number;
};

export function TestCaseInput({
  defaultValue,
  testCaseIndex,
  paramIndex,
}: TestCaseInputsProps) {
  const [dataType, setDataType] = useState(DataType.create(""));
  const { control, watch } = useFormContext<ChallengeSchema>();
  const { update } = useFieldArray({
    control,
    name: `testCases.${testCaseIndex}.inputs`,
  });
  const paramDataTypeName = watch(`function.params.${paramIndex}.dataTypeName`);

  function handleChange(value: unknown) {
    update(paramIndex, { value });
    setDataType(dataType.changeValue(value));
  }

  useEffect(() => {
    const dataType = DataType.create(
      DEFAULT_VALUE_BY_DATA_TYPE_NAME[paramDataTypeName]
    );
    setDataType(dataType);
    update(paramIndex, { value: dataType.value });
  }, [paramDataTypeName, paramIndex, update]);

  useEffect(() => {
    if (!defaultValue) return;

    const timemout = setTimeout(() => {
      setDataType(DataType.create(defaultValue));
    }, 1000);
    return () => clearTimeout(timemout);
  }, []);

  return (
    <CodeInput label={`${paramIndex + 1}º Parâmetro`}>
      <div className="flex items-center gap-3">
        <DataTypeNameSelect value={dataType.name} isDiabled={true} />
        <DataTypeInput value={dataType} onChange={handleChange} />
      </div>
    </CodeInput>
  );
}
