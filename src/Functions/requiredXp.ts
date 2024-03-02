function CalcRequiredXP(level: number) {
    return Math.floor(100 * (level / 2));
}

export { CalcRequiredXP }