
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { FormControl } from '@/components/ui/form';

interface SearchableAssetSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const SearchableAssetSelect: React.FC<SearchableAssetSelectProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const { state } = useAppContext();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  // Make sure assets is always an array, even if it's undefined
  const assets = state?.assets || [];

  // Handle the selection of an asset
  const handleSelect = (currentValue: string) => {
    onChange(currentValue);
    setOpen(false);
  };

  // Find the selected asset
  const selectedAsset = assets.find((asset) => asset.symbol === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              !value && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            {value && selectedAsset ? selectedAsset.symbol : t('trade.asset')}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput placeholder={t('trade.searchAsset')} />
          </div>
          <CommandEmpty>{t('trade.noAssetsFound')}</CommandEmpty>
          <CommandGroup>
            {assets.map((asset) => (
              <CommandItem
                key={asset.id}
                value={asset.symbol}
                onSelect={handleSelect}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === asset.symbol ? "opacity-100" : "opacity-0"
                  )}
                />
                {asset.symbol}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SearchableAssetSelect;
