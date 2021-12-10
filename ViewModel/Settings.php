<?php
declare(strict_types=1);

namespace Vendic\GoogleAutocomplete\ViewModel;

use Magento\Framework\View\Element\Block\ArgumentInterface;
use Vendic\GoogleAutocomplete\Model\Config\Settings as ConfigSettings;

class Settings implements ArgumentInterface
{
    private ConfigSettings $settings;

    public function __construct(
        ConfigSettings $settings
    ) {
        $this->settings = $settings;
    }

    /**
     * @return string
     */
    public function getApiKey(): string
    {
        return $this->settings->getApiKey();
    }

    public function getStreetLinesQty(): string
    {
        return $this->settings->getStreetLinesQty();
    }
}
